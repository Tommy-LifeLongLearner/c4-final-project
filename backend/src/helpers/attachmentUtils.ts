import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AttachmentUtils');
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION);
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

// TODO: Implement the fileStogare logic
export const generateSignedURL = (userId, todoId) => {
  const objectName = `${userId}.${todoId}`;
  try {
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: objectName,
      Expires: urlExpiration
    });

    return signedUrl;
  }catch(err) {
    logger.error({
      func: "generateSignedURL",
      err: err.message,
      params: {
        objectName
      }
    });
  }
}