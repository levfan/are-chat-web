"""Build are-chat-web release asset and sync it to the GitHub Release.

Run from anywhere; paths are resolved from this script location. The GitHub
token is read from GITHUB_TOKEN / GH_TOKEN or git credential fill and never
printed. Requires tracked files to be clean unless --allow-dirty is given.
Only major versions are released unless --force is given.
"""

import argparse
import datetime
import hashlib
import http.client
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve()
ROOT = HERE.parents[4]
OWNER = "levfan"
REPO = "are-chat-web"
API = "/repos/%s/%s" % (OWNER, REPO)
ASSET_TMPL = "are-chat-web-{v}-dist.zip"


def log(msg):
    print(msg, flush=True)


def package_version():
    text = (ROOT / "package.json").read_text(encoding="utf-8")
    m = re.search(r'"version"\s*:\s*"([^"]+)"', text)
    if not m:
        raise RuntimeError("package.json 里找不到 version 字段")
    return m.group(1).strip()


def is_major(ver):
    m = re.match(r"^(\d+)\.(\d+)\.(\d+)", ver)
    return bool(m) and m.group(2) == "0" and m.group(3) == "0"


def git(*args):
    r = subprocess.run(["git"] + list(args), cwd=str(ROOT), text=True,
                       encoding="utf-8", errors="replace", capture_output=True)
    if r.returncode:
        raise RuntimeError("git %s 失败：%s" % (" ".join(args), r.stderr.strip()[:300]))
    return r.stdout.strip()


def token():
    for key in ("GITHUB_TOKEN", "GH_TOKEN"):
        if os.environ.get(key):
            return os.environ[key]
    r = subprocess.run(["git", "credential", "fill"], cwd=str(ROOT),
                       input="protocol=https\nhost=github.com\n\n",
                       text=True, encoding="utf-8", errors="replace", capture_output=True)
    got = dict(l.strip().split("=", 1) for l in r.stdout.splitlines() if "=" in l).get("password", "")
    if not got:
        raise RuntimeError("找不到 GitHub 令牌：设 GITHUB_TOKEN 或配置 git credential")
    return got


TOKEN = None
HEADERS = None


def init_auth():
    global TOKEN, HEADERS
    TOKEN = token()
    HEADERS = {
        "Authorization": "Bearer " + TOKEN,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "are-chat-web-release-assets",
    }


def api(method, path, payload=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = dict(HEADERS)
    if data is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request("https://api.github.com" + path, data=data,
                                 headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")
        try:
            return e.code, json.loads(raw)
        except ValueError:
            return e.code, raw[:300]


def api_retry(method, path, payload=None, tries=4, label=""):
    last = None
    for attempt in range(1, tries + 1):
        try:
            st, data = api(method, path, payload)
        except Exception as e:
            st, data = 0, "%s %s" % (type(e).__name__, str(e)[:160])
        if 200 <= st < 300:
            return st, data
        last = (st, data)
        log("RETRY %s HTTP %s %s" % (label or method, st, str(data)[:160]))
        if attempt < tries:
            time.sleep(2 * attempt)
    return last


def run_cmd(cmd, cwd, label="构建"):
    log("RUN %s" % cmd)
    p = subprocess.run(cmd, cwd=str(cwd), shell=True, text=True,
                       encoding="utf-8", errors="replace",
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in (p.stdout or "").splitlines():
        log("  | " + line.rstrip())
    if p.returncode:
        raise RuntimeError("%s 失败（退出码 %d）" % (label, p.returncode))


def stage_old_dist(ver):
    src = ROOT / "dist"
    if not src.exists():
        return
    backup = ROOT / ".workbuddy" / ("dist-backup-v" + ver + "-" +
                                    datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
    dst = backup / "dist"
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), str(dst))
    log("STAGE old dist -> %s" % dst.relative_to(ROOT))


def build_frontend():
    run_cmd("pnpm build", ROOT, label="前端构建")
    if not (ROOT / "dist" / "index.html").exists():
        raise RuntimeError("dist/index.html 未生成，前端构建不完整")


def zip_dist(ver):
    name = ASSET_TMPL.format(v=ver)
    out_dir = ROOT / "target" / "release-assets" / ("v" + ver)
    out_dir.mkdir(parents=True, exist_ok=True)
    dst = out_dir / name
    src = ROOT / "dist"
    n = 0
    t0 = time.time()
    with zipfile.ZipFile(str(dst), "w", zipfile.ZIP_DEFLATED, compresslevel=6, allowZip64=True) as zf:
        for base, dirs, files in os.walk(str(src)):
            dirs.sort()
            for f in sorted(files):
                full = Path(base) / f
                arc = full.relative_to(src.parent).as_posix()
                zf.write(str(full), arc)
                n += 1
    with zipfile.ZipFile(str(dst)) as zf:
        bad = zf.testzip()
    if bad:
        raise RuntimeError("zip 校验失败：%s 里的 %s" % (name, bad))
    h = hashlib.sha256()
    with open(str(dst), "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    log("ZIP %s | %d files | %.1f MB | sha256=%s | %.1fs" %
        (name, n, dst.stat().st_size / 1048576, h.hexdigest(), time.time() - t0))
    return name, dst, h.hexdigest()


def make_body(ver, name, sha, commit):
    return "\n".join([
        "## are-chat-web %s" % ver,
        "",
        "静态包与后端 `are-chat` 同版本发布，可直接部署到 nginx；后端 API 由部署环境反代提供。",
        "不含密钥，凭据由运维单独注入。",
        "",
        "| 资产 | 说明 |",
        "| --- | --- |",
        "| `%s` | 静态站点，zip 内保留 `dist/` 顶层目录 |" % name,
        "",
        "构建提交：`%s`。发布由 `release-assets` 技能同步。" % commit,
        "",
        "### SHA-256",
        "",
        "- `%s`: `%s`" % (name, sha),
        "",
    ])


def ensure_release(ver, body, prerelease):
    tag = "v" + ver
    st, rel = api("GET", API + "/releases/tags/" + urllib.parse.quote(tag))
    if st == 200:
        log("RELEASE found %s | id=%s" % (tag, rel["id"]))
        st, _ = api_retry("PATCH", API + "/releases/%s" % rel["id"],
                          {"body": body, "prerelease": prerelease}, label="PATCH body")
        if st < 200 or st >= 300:
            raise RuntimeError("更新发布说明失败：HTTP %s" % st)
        log("PATCH body HTTP %s" % st)
        return rel
    if st != 404:
        raise RuntimeError("查询 Release 失败：HTTP %s %s" % (st, str(rel)[:200]))
    st, rel = api_retry("POST", API + "/releases", {
        "tag_name": tag, "name": tag, "body": "are-chat-web " + ver,
        "draft": False, "prerelease": prerelease, "generate_release_notes": False}, label="POST release")
    if st < 200 or st >= 300:
        raise RuntimeError("创建 Release 失败：HTTP %s %s" % (st, str(rel)[:200]))
    log("RELEASE created %s | id=%s | %s" % (tag, rel["id"], rel.get("html_url", "")))
    st, _ = api_retry("PATCH", API + "/releases/%s" % rel["id"], {"body": body}, label="PATCH body")
    if st < 200 or st >= 300:
        raise RuntimeError("写入发布说明失败：HTTP %s" % st)
    return rel


def body_hashes(rel):
    return dict(re.findall(r"- `([^`]+)`: `([0-9a-f]{64})`", rel.get("body", "")))


def upload(path, name, rel_id):
    size = path.stat().st_size
    url = "%s/releases/%s/assets?name=%s" % (API, rel_id, urllib.parse.quote(name))
    for attempt in range(1, 4):
        try:
            conn = http.client.HTTPSConnection("uploads.github.com", timeout=900)
            conn.putrequest("POST", url)
            for k, v in HEADERS.items():
                conn.putheader(k, v)
            conn.putheader("Content-Type", "application/zip")
            conn.putheader("Content-Length", str(size))
            conn.endheaders()
            sent = 0
            with open(str(path), "rb") as f:
                while True:
                    chunk = f.read(1 << 20)
                    if not chunk:
                        break
                    conn.send(chunk)
                    sent += len(chunk)
            r = conn.getresponse()
            raw = r.read()
            conn.close()
            if r.status in (200, 201):
                a = json.loads(raw.decode("utf-8"))
                log("UPLOADED %s | %s" % (name, a.get("browser_download_url", "")))
                return
            log("RETRY %s HTTP %s %s" % (name, r.status, raw[:160].decode("utf-8", "replace")))
        except Exception as e:
            log("RETRY %s %s %s" % (name, type(e).__name__, str(e)[:160]))
        if attempt < 3:
            time.sleep(3 * attempt)
    raise RuntimeError("上传失败：" + name)


def sync(ver, name, path, sha):
    init_auth()
    prerelease = bool(re.search(r"-(alpha|beta|rc)\.", ver))
    commit = git("rev-parse", "--short", "HEAD")
    rel = ensure_release(ver, make_body(ver, name, sha, commit), prerelease)
    have = {a["name"]: a for a in rel.get("assets", [])}
    recorded = body_hashes(rel)
    if name in have and have[name]["size"] == path.stat().st_size and recorded.get(name) == sha:
        log("SKIP %s | 资产与 SHA-256 已同步" % name)
    else:
        if name in have:
            st, _ = api("DELETE", API + "/releases/assets/%s" % have[name]["id"])
            if st != 204:
                raise RuntimeError("删除旧资产失败：%s HTTP %s" % (name, st))
            log("REPLACE %s" % name)
        upload(path, name, rel["id"])
    st, final = api("GET", API + "/releases/tags/" + urllib.parse.quote("v" + ver))
    if st != 200:
        raise RuntimeError("复核 Release 失败：HTTP %s" % st)
    ok = name in {a["name"] for a in final.get("assets", [])}
    log("FINAL %s | %s" % ("OK" if ok else "MISSING ASSET", final.get("html_url", "")))
    for a in final.get("assets", []):
        log("ASSET %s | %d" % (a["name"], a["size"]))
    if not ok:
        raise RuntimeError("资产清单不齐")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip-build", action="store_true", help="复用当前 dist")
    ap.add_argument("--allow-dirty", action="store_true", help="允许工作区有已跟踪改动")
    ap.add_argument("--no-upload", action="store_true", help="只打包，不碰 GitHub")
    ap.add_argument("--force", action="store_true", help="非 major 版本也执行，需用户明确要求")
    args = ap.parse_args()
    ver = package_version()
    if not args.force and not is_major(ver):
        raise RuntimeError("版本 %s 不是 major（X.0.0），发版链路未触发；确需发布加 --force" % ver)
    if not args.allow_dirty and git("status", "--porcelain", "--untracked-files=no"):
        raise RuntimeError("工作区有已跟踪改动：先提交再发布")
    log("VERSION %s | major=%s" % (ver, is_major(ver)))
    if not args.skip_build:
        stage_old_dist(ver)
        build_frontend()
    name, path, sha = zip_dist(ver)
    if args.no_upload:
        log("NO-UPLOAD | 本地 zip 与 SHA-256 已就绪")
        return
    sync(ver, name, path, sha)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        log("FAILED " + str(exc))
        sys.exit(1)
