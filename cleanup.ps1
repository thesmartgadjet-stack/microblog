
$postsDir = "src/content/posts"
$files = Get-ChildItem -Path "$postsDir/*.md"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    
    # Split frontmatter
    if ($content -match "(?s)^---\s*(.*?)\s*---\s*(.*)") {
        $fm = $Matches[1].Trim()
        $body = $Matches[2]
        
        $newFm = ""
        
        # Detect if JSON or already YAML
        if ($fm.StartsWith("{")) {
            Write-Host "  Detected JSON frontmatter. Converting..."
            # Very basic extraction for the known schema
            if ($fm -match '"title":\s*"(.*?)"') { $newFm += "title: `"$($Matches[1])`"`n" }
            if ($fm -match '"slug":\s*"(.*?)"') { $newFm += "slug: `"$($Matches[1])`"`n" }
            if ($fm -match '"pubDate":\s*"(.*?)"') { $newFm += "pubDate: `"$($Matches[1])`"`n" }
            if ($fm -match '"description":\s*"(.*?)"') { $newFm += "description: `"$($Matches[1])`"`n" }
            if ($fm -match '"category":\s*"(.*?)"') { $newFm += "category: `"$($Matches[1])`"`n" }
            if ($fm -match '"author":\s*"(.*?)"') { $newFm += "author: `"$($Matches[1])`"`n" }
            if ($fm -match '"image":\s*"(.*?)"') { $newFm += "image: `"$($Matches[1])`"`n" }
        } else {
            $newFm = $fm
        }
        
        # Fix Body Indentation
        # We look for lines starting with at least 4 spaces or a tab, and check if it looks like HTML
        $bodyLines = $body -split "`r?`n"
        $newBodyLines = @()
        $fixedLines = 0
        
        foreach ($line in $bodyLines) {
            if ($line -match "^\s{4,}<") {
                $newBodyLines += $line.TrimStart()
                $fixedLines++
            } else {
                $newBodyLines += $line
            }
        }
        
        $finalContent = "---`n$($newFm.Trim())`n---`n$($newBodyLines -join "`n")"
        $finalContent | Set-Content $file.FullName
        Write-Host "  Done. Fixed $fixedLines lines."
    }
}
