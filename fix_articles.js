
const fs = require('fs');
const path = require('path');

const postsDir = 'src/content/posts';

function fixFile(filename) {
    const filepath = path.join(postsDir, filename);
    console.log(`Processing ${filepath}...`);
    let content;
    try {
        content = fs.readFileSync(filepath, 'utf8');
    } catch (err) {
        console.error(`Error reading ${filepath}:`, err);
        return;
    }

    const parts = content.split('---');
    if (parts.length < 3) {
        console.warn(`Skipping ${filepath}: No frontmatter found.`);
        return;
    }

    const frontmatter = parts[1];
    const body = parts.slice(2).join('---');

    // Check frontmatter fields
    const requiredFields = ['title:', 'pubDate:', 'description:', 'author:', 'image:'];
    const missing = requiredFields.filter(f => !frontmatter.includes(f));
    if (missing.length > 0) {
        console.warn(`  WARNING: Missing fields in frontmatter: ${missing.join(', ')}`);
    }

    // Fix indentation in body
    const lines = body.split('\n');
    let fixedCount = 0;
    const newLines = lines.map(line => {
        const stripped = line.trimStart();
        if (line.startsWith('    ') || line.startsWith('\t')) {
            if (stripped.startsWith('<')) {
                fixedCount++;
                return stripped;
            }
        }
        return line;
    });

    if (fixedCount > 0) {
        console.log(`  Fixed ${fixedCount} indented lines.`);
        const newContent = '---' + frontmatter + '---' + newLines.join('\n');
        fs.writeFileSync(filepath, newContent, 'utf8');
    } else {
        console.log("  No indentation issues found.");
    }
}

fs.readdirSync(postsDir).forEach(file => {
    if (file.endsWith('.md')) {
        fixFile(file);
    }
});
