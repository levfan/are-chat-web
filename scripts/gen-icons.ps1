Add-Type -AssemblyName System.Drawing

function New-AppIcon {
    param(
        [int]$Size,
        [string]$Path,
        [bool]$FullBleed,
        [double]$TextScale = 0.53
    )
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $c1 = [System.Drawing.Color]::FromArgb(0x5b, 0x8c, 0xff)
    $c2 = [System.Drawing.Color]::FromArgb(0x2f, 0x66, 0xf0)
    $rect = if ($FullBleed) {
        New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    } else {
        # 与 favicon.svg 一致：2/64 边距、16/64 圆角
        $m = [int]([math]::Round($Size * 2 / 64)); $w = $Size - 2 * $m
        New-Object System.Drawing.Rectangle($m, $m, $w, $w)
    }
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45.0)
    if ($FullBleed) {
        $g.FillRectangle($brush, $rect)
    } else {
        $radius = [float]($Size * 16 / 64)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
        $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
        $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
        $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $g.FillPath($brush, $path)
        $path.Dispose()
    }

    # 白色粗体 A（与 favicon 同款）
    $fontSize = [float]($Size * $TextScale * 34 / 64)
    $font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $white = [System.Drawing.Brushes]::White
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = New-Object System.Drawing.RectangleF(0, ($Size * 0.02), $Size, $Size)
    $g.DrawString('A', $font, $white, $textRect, $fmt)

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $brush.Dispose(); $font.Dispose(); $bmp.Dispose()
    Write-Output "saved $Path ($((Get-Item $Path).Length) bytes)"
}

$out = 'D:\00.personal\4.code\are-chat-web\public\icons'
New-Item -ItemType Directory -Force -Path $out | Out-Null
New-AppIcon -Size 512 -Path "$out\icon-512.png" -FullBleed $false
New-AppIcon -Size 192 -Path "$out\icon-192.png" -FullBleed $false
New-AppIcon -Size 180 -Path "$out\icon-180.png" -FullBleed $true -TextScale 0.5
# maskable：全出血 + 内容缩小到 80% 安全区内
New-AppIcon -Size 512 -Path "$out\icon-maskable-512.png" -FullBleed $true -TextScale 0.42
