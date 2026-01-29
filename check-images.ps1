$postsPath = "c:\Users\brahim\Documents\GitHub\microblog\src\content\posts"
$imagesPath = "c:\Users\brahim\Documents\GitHub\microblog\src\images\blog"

# Get all markdown files
$mdFiles = Get-ChildItem -Path $postsPath -Filter "*.md"

$missingImages = @()

foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Find all image references
    $imageMatches = [regex]::Matches($content, '!\[.*?\]\((\.\.\/\.\.\/images\/blog\/[^)]+)\)')
    
    foreach ($match in $imageMatches) {
        $imagePath = $match.Groups[1].Value
        # Convert relative path to absolute
        $imageName = Split-Path $imagePath -Leaf
        $fullImagePath = Join-Path $imagesPath $imageName
        
        if (-not (Test-Path $fullImagePath)) {
            $missingImages += [PSCustomObject]@{
                Article = $file.Name
                Image = $imageName
            }
        }
    }
}

if ($missingImages.Count -gt 0) {
    Write-Host "Missing images found:" -ForegroundColor Red
    $missingImages | Format-Table -AutoSize
} else {
    Write-Host "All images are present!" -ForegroundColor Green
}
