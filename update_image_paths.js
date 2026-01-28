import fs from 'fs';
import path from 'path';

const postsDir = 'src/content/posts';
const files = fs.readdirSync(postsDir);

files.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(postsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace /images/blog/ with ../../images/blog/
        // This handles both frontmatter and content references
        const newContent = content.replace(/\/images\/blog\//g, '../../images/blog/');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});
