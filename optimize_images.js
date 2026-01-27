
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'public/images/blog');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    files.forEach((file) => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
            const inputFile = path.join(directoryPath, file);
            const outputFile = path.join(directoryPath, path.parse(file).name + '.webp');

            sharp(inputFile)
                .resize({ width: 1200, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(outputFile)
                .then((info) => {
                    console.log(`Optimized ${file}: ${info.size} bytes`);
                })
                .catch((err) => {
                    console.error(`Error processing ${file}: ${err}`);
                });
        }
    });
});
