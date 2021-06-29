import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
import fs from 'fs';
import { Express } from 'express';
import internal from 'stream';

dotenv.config({});

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME as string;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const upload = (file: Express.Multer.File): Promise<S3.ManagedUpload.SendData> => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams: S3.PutObjectRequest = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

export const download = (fileKey: string): internal.Readable => {
  const downloadParams: S3.GetObjectRequest = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};
