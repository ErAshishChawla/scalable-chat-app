import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

const region = process.env.S3_BUCKET_REGION!;
const bucketName = process.env.S3_BUCKET_NAME!;
const accessKeyId = process.env.S3_ACCESS_KEY_ID!;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!;

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const avatarKeyGenerator = (emailId: string) => {
  return `avatars/image-${emailId}`;
};

export const getObjectURL = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command);

  return url;
};

export const putObjectURL = async (key: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 120 });

  return url;
};
