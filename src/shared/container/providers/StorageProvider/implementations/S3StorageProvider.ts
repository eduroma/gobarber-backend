import fs from 'fs';
import path from 'path'
import aws, { S3 } from 'aws-sdk';
import mime from 'mime'

import uploadConfig from '@config/upload';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {

  private client: S3;

  constructor() {
    this.client = new aws.S3()
  }

  public async saveFile(file: string): Promise<string> {

    const originalFile = path.resolve(uploadConfig.tmpDirectory, file);

    const ContentType = mime.getType(originalFile);

    if (!ContentType) {
      throw new Error('File not found!')
    }

    const fileContent = await fs.promises.readFile(originalFile)

    await this.client.putObject({
      Bucket: uploadConfig.config.s3.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType
    }).promise();

    await fs.promises.unlink(originalFile);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: uploadConfig.config.s3.bucket,
      Key: file
    }).promise();
  }
}
