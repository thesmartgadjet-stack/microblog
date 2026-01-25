
import os
import re

posts_dir = r'c:\Users\brahim\Documents\GitHub\microblog\src\content\posts'

def fix_file(filepath):
    print(f"Processing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split frontmatter
    parts = content.split('---')
    if len(parts) < 3:
        print(f"Skipping {filepath}: No frontmatter found.")
        return

    frontmatter = parts[1]
    body = '---'.join(parts[2:])

    # Check frontmatter fields
    required_fields = ['title:', 'pubDate:', 'description:', 'author:', 'image:']
    missing = [f for f in required_fields if f not in frontmatter]
    if missing:
        print(f"  WARNING: Missing fields in frontmatter: {missing}")

    # Fix indentation in body
    # We want to remove leading spaces if they precede an HTML tag or a paragraph
    lines = body.split('\n')
    new_lines = []
    fixed_count = 0
    for line in lines:
        stripped = line.lstrip()
        if line.startswith('    ') or line.startswith('\t'):
            # If it's heavily indented and looks like HTML, unindent it
            if stripped.startswith('<'):
                new_lines.append(stripped)
                fixed_count += 1
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    if fixed_count > 0:
        print(f"  Fixed {fixed_count} indented lines.")
        new_content = '---' + frontmatter + '---' + '\n'.join(new_lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    else:
        print("  No indentation issues found.")

for filename in os.listdir(posts_dir):
    if filename.endswith('.md'):
        fix_file(os.path.join(posts_dir, filename))
