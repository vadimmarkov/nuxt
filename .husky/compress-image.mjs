/**
 * A precommit script to compress image before commiting file
 */

import fs from 'fs';
import sharp from 'sharp';

const compressOptions = {
    jpeg: { quality: 80 },
    png: { quality: 80 },
    webp: { quality: 80 },
    avif: { quality: 70 },
};

function getExtension(filename) {
    const ext = filename.split('.');
    return ext[ext.length - 1];
}

const minifyFile = (filename) =>
    new Promise((resolve, reject) => {
        fs.readFile(filename, function (err, sourceData) {
            if (err) throw err;

            let format = getExtension(filename);

            if (format === 'jpg') {
                format = 'jpeg';
            }

            sharp(sourceData)
                [format](compressOptions[format])
                .toFile(filename, (err, info) => {
                    err ? reject(err) : resolve();
                });
        });
    });

/**
 * Fetch images maps from args and compress all.
 * Compressing is asynchronuous process.
 * So wait for all image to compress and return.
 *
 * Find more here: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */

Promise.resolve(process.argv)
    .then((x) => x.slice(2))
    .then((x) => x.map(minifyFile))
    .then((x) => Promise.all(x))
    .catch(() => {
        process.exit(1);
    });
