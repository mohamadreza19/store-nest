import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { UUID } from 'mongodb';

// const s3 = new S3Client({
//   region: 'default',
//   endpoint: 'https://s3.ir-thr-at1.arvanstorage.ir',
//   credentials: {
//     accessKeyId: 'b211b927-7f27-4996-9089-d451883fae25',
//     secretAccessKey:
//       '3602358e7b87df59442ebae7a9d15ac5ab2c7014d99ad6bbb97dc61432107d6b',
//   },
// });

type suffixKey = 'webp' | 'mp4';

class Storage {
  private readonly s3 = new S3Client({
    region: 'default',
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.STORAGE_KEYID,
      secretAccessKey: process.env.STORAGE_ACCESSKEY,
    },
  });

  add(buffer: Buffer, name: string) {
    // const uniuqeName = new UUID().toString() + suffix;

    return this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: name,
        Body: buffer,
        ACL: 'public-read',
      }),
    );
  }
  getFormatFromMimtype(fileMimetype: string) {
    return fileMimetype.split('/')[1];
  }
}

export default Storage;
