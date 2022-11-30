import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const namdev96_s3_bucket = process.env.ATTACHMENT_S3_BUCKET

// // TODO: Implement the fileStogare logic

export function getUploadImageUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: namdev96_s3_bucket,
    Key: imageId,
    Expires: 300
  })
}
