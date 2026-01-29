const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src', 'content', 'posts');
const files = fs.readdirSync(postsDir);

const replacements = [
    [/â€”/g, '—'],
    [/â€“/g, '–'],
    [/â€™/g, "'"],
    [/â€˜/g, "'"],
    [/â€œ/g, '"'],
    [/â€/g, '"'], // em-dash? no, wait.
    [/â€ /g, '"'],
    [/â€¦/g, '...'],
    [/Â°/g, '°']
];

files.forEach(file => {
    if (file.endsWith('.md')) {
        const filePath = path.join(postsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        replacements.forEach(([regex, replacement]) => {
            content = content.replace(regex, replacement);
        });

        // Also fix the case where the file starts with 'n'
        if (content.startsWith('n\n')) {
            content = content.substring(2);
        } else if (content.startsWith('n\r\n')) {
            content = content.substring(3);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
