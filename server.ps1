$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://127.0.0.1:5500/')
$listener.Start()
Write-Host "Server running at http://127.0.0.1:5500/"
$baseDir = "e:\antigravity\Himel"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.RawUrl.Split('?')[0]
        if ($rawUrl -eq '/' -or $rawUrl -eq '') { $rawUrl = '/index.html' }
        $filePath = Join-Path $baseDir $rawUrl.TrimStart('/').Replace('/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = 'text/plain'
            switch ($ext) {
                '.html' { $mime = 'text/html; charset=utf-8' }
                '.css'  { $mime = 'text/css; charset=utf-8' }
                '.js'   { $mime = 'application/javascript; charset=utf-8' }
                '.jpg'  { $mime = 'image/jpeg' }
                '.jpeg' { $mime = 'image/jpeg' }
                '.png'  { $mime = 'image/png' }
                '.svg'  { $mime = 'image/svg+xml' }
                '.webp' { $mime = 'image/webp' }
                '.pdf'  { $mime = 'application/pdf' }
            }
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.OutputStream.Close()
    } catch {
        # Continue listening on socket errors or client disconnects
    }
}
