/** 新消息提示音：WebAudio 现场合成，无需音频资源；无声环境静默失败。 */
let ctx: AudioContext | null = null

export function playMessageTone() {
  try {
    const Ctor = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
    const Impl = Ctor.AudioContext ?? Ctor.webkitAudioContext
    if (!Impl) {
      return
    }
    ctx ??= new Impl()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }
    const now = ctx.currentTime
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
    gain.connect(ctx.destination)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.setValueAtTime(1320, now + 0.12)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.4)
  } catch {
    // 无 AudioContext（如 jsdom）时静默忽略
  }
}
