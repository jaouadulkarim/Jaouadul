# Bundles all assets, CSS, JS, Tailwind, and Images into a 100% self-contained standalone HTML file
$ErrorActionPreference = "Stop"

$workspaceDir = "e:\antigravity\Himel"
$indexPath = Join-Path $workspaceDir "index.html"
$standalonePath = Join-Path $workspaceDir "Himel_Portfolio_Standalone.html"
$devIndexPath = Join-Path $workspaceDir "index.dev.html"
$stylePath = Join-Path $workspaceDir "assets\css\style.css"
$tailwindPath = Join-Path $workspaceDir "assets\js\tailwind.cdn.js"
$mainJsPath = Join-Path $workspaceDir "assets\js\main.js"
$darkImgPath = Join-Path $workspaceDir "assets\images\himel-dark.jpg"
$origImgPath = Join-Path $workspaceDir "assets\images\himel.jpg"

Write-Host "Reading image files and encoding to Base64..."
$darkBytes = [System.IO.File]::ReadAllBytes($darkImgPath)
$darkB64 = "data:image/jpeg;base64," + [System.Convert]::ToBase64String($darkBytes)

$origBytes = [System.IO.File]::ReadAllBytes($origImgPath)
$origB64 = "data:image/jpeg;base64," + [System.Convert]::ToBase64String($origBytes)

Write-Host "Image sizes encoded: Dark=$($darkB64.Length) chars, Original=$($origB64.Length) chars"

Write-Host "Reading CSS and JS files..."
$styleCss = [System.IO.File]::ReadAllText($stylePath, [System.Text.Encoding]::UTF8)
$tailwindJs = [System.IO.File]::ReadAllText($tailwindPath, [System.Text.Encoding]::UTF8)
$mainJs = [System.IO.File]::ReadAllText($mainJsPath, [System.Text.Encoding]::UTF8)

# Update main.js image references to base64
$mainJs = $mainJs.Replace("'assets/images/himel-dark.jpg'", "'$darkB64'")
$mainJs = $mainJs.Replace("'assets/images/himel.jpg'", "'$origB64'")
$dummySvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3C/svg%3E"
$mainJs = $mainJs.Replace("'assets/images/project-1-ecommerce.jpg'", "'$dummySvg'")
$mainJs = $mainJs.Replace("'assets/images/project-2-churn.jpg'", "'$dummySvg'")
$mainJs = $mainJs.Replace("'assets/images/project-3-finance.jpg'", "'$dummySvg'")

Write-Host "Reading index.dev.html..."
$html = [System.IO.File]::ReadAllText($devIndexPath, [System.Text.Encoding]::UTF8)

# 1. Replace Tailwind loading with inlined Tailwind runtime engine
$tailwindOldBlock = @"
  <!-- Tailwind CSS Engine (With Offline Local Fallback) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    if (typeof tailwind === 'undefined') {
      document.write('<script src="assets/js/tailwind.cdn.js"><\/script>');
    }
  </script>
"@

$tailwindInlinedBlock = @"
  <!-- Inlined Standalone Tailwind CSS Runtime Engine (Works 100% Offline) -->
  <script>
$tailwindJs
  </script>
"@

if ($html.Contains($tailwindOldBlock)) {
    $html = $html.Replace($tailwindOldBlock, $tailwindInlinedBlock)
    Write-Host "Replaced Tailwind block successfully."
} else {
    Write-Warning "Could not find exact Tailwind block."
}

# 2. Replace CSS link with inlined style
$cssOldLink = '<link rel="stylesheet" href="assets/css/style.css">'
$cssInlinedBlock = @"
  <!-- Inlined Core Design System & Theme Stylesheet -->
  <style>
$styleCss
  </style>
"@

if ($html.Contains($cssOldLink)) {
    $html = $html.Replace($cssOldLink, $cssInlinedBlock)
    Write-Host "Replaced CSS link successfully."
} else {
    Write-Warning "Could not find CSS link."
}

# 3. Replace image references in HTML (ONLY on <img> tags, NEVER inside <head> <meta> tags)
$html = $html.Replace('src="assets/images/himel-dark.jpg"', "src=`"$darkB64`"")
Write-Host "Replaced himel-dark.jpg img src with Base64."

$certImgPath = Join-Path $workspaceDir "assets\images\python_101_data_science_cert.jpg"
if (Test-Path $certImgPath) {
    $certBytes = [System.IO.File]::ReadAllBytes($certImgPath)
    $certB64 = "data:image/jpeg;base64," + [System.Convert]::ToBase64String($certBytes)
    $html = $html.Replace('src="assets/images/python_101_data_science_cert.jpg"', "src=`"$certB64`"")
    Write-Host "Replaced python_101_data_science_cert.jpg img src with Base64."
}

# 4. Replace main.js link with inlined script
$jsOldLink = '<script src="assets/js/main.js"></script>'
$jsInlinedBlock = @"
  <!-- Inlined Interactive Application Logic & Portfolio Controller -->
  <script>
$mainJs
  </script>
"@

if ($html.Contains($jsOldLink)) {
    $html = $html.Replace($jsOldLink, $jsInlinedBlock)
    Write-Host "Replaced main.js link successfully."
} else {
    Write-Warning "Could not find main.js script tag."
}

# Write out the clean index.html (for GitHub Pages and web hosting)
Copy-Item -Path $devIndexPath -Destination $indexPath -Force
Write-Host "Generated clean production index.html (Size: $((Get-Item $indexPath).Length) bytes)."

# Write out the self-contained Himel_Portfolio_Standalone.html (portable single-file version)
[System.IO.File]::WriteAllText($standalonePath, $html, [System.Text.Encoding]::UTF8)
Write-Host "Generated portable Himel_Portfolio_Standalone.html (Size: $((Get-Item $standalonePath).Length) bytes)."
