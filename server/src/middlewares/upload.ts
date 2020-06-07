import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import { Request, Response } from 'restify';
import { File as IRestifyFile } from 'formidable/index';

function getFileHash(file: IRestifyFile) {
  return new Promise<string>((resolve, reject) => {
    let shasum = crypto.createHash('sha1');

    try {
      const stream = fs.createReadStream(file.path);

      stream.on('data', (data) => {
        shasum.update(data);
      });

      stream.on('end', () => {
        const hash = shasum.digest('hex');
        resolve(hash);
      });

    } catch (err) {
      reject(err);
    }
  });
}

export default async function uploadMiddleware(request: Request, response: Response, next: Function) {
  if (!request.files) {
    next();
    return;
  }

  const uploads = Object.entries(request.files);
  if (uploads.length === 0) {
    next();
    return;
  }

  for (let i = 0; i < uploads.length; i += 1) {
    const [fieldName, file] = uploads[i];

    if (!file) {
      continue;
    }

    const fileJson = file.toJSON() as any;
    const fileExtension = fileJson.type.split('/')[1];

    const fileHash = await getFileHash(file);
    const fileName = `${fileHash}.${fileExtension}`;

    fs.renameSync(file.path!, path.resolve(__dirname, '..', '..', 'uploads', fileName));
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path!);
    }

    request.body[fieldName] = fileName;
  }

  next();
}
