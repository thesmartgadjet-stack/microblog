
$postsDir = "src/content/posts"
$files = Get-ChildItem -Path "$postsDir/*.md"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    if ($content -match "(?s)^---\s*(.*?)\s*---\s*(.*)") {
        $fm = $Matches[1]
        $body = $Matches[2]
        
        # Replace base64 image strings
        # JSON style
        $fm = $fm -replace '"image":\s*"data:image/.*?;base64,.*?"', "`"image`": `"https://picsum.photos/seed/$($file.BaseName)/1200/630`""
        # YAML style
        $fm = $fm -replace 'image:\s*"data:image/.*?;base64,.*?"', "image: `"https://picsum.photos/seed/$($file.BaseName)/1200/630`""
        $fm = $fm -replace 'image:\s*data:image/.*?;base64,.*?\s*\n', "image: https://picsum.photos/seed/$($file.BaseName)/1200/630`n"

        $newContent = "---`n" + $fm.Trim() + "`n---`n" + $body
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
        Write-Host "  Cleaned up frontmatter."
    }
}
