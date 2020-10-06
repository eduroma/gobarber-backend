import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve('tmp');

interface IUploadConfig {
  driver: 'disk' | 's3';
  tmpDirectory: string;
  uploadDirectory: string;
  multer: {
    storage: StorageEngine;
  }
  config: {
    disk: {},
    s3: {
      bucket: string,
      region: string;

    }
  }
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  tmpDirectory: tempFolder,
  uploadDirectory: path.resolve(tempFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    })
  },
  config: {
    disk: {},
    s3: {
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION
    }
  }

} as IUploadConfig;
