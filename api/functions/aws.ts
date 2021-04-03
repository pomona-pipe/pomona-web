import S3, { ObjectIdentifierList, Prefix } from "aws-sdk/clients/s3";
import { AWSFileUpload } from "../types";

const Bucket = "pomona-dropbox";

function createS3(Prefix?: string) {
  return new S3({
    endpoint: "s3.us-east-1.amazonaws.com",
    params: {
      Bucket,
      Prefix,
    },
  });
}

export async function s3DeleteFiles(filePaths: string[]) {
  const s3 = createS3();
  const deleteObjects: ObjectIdentifierList = filePaths.map((path) => ({
    Key: path,
  }));
  const deleteResponse = s3
    .deleteObjects({
      Bucket: s3.config.params!.Bucket,
      Delete: {
        Objects: deleteObjects,
      },
    })
    .promise()
    .then((data) => data.Deleted);
  return deleteResponse;
}

// TODO: allow for more than 1000 files by passing a continuation token
export async function s3ListFiles(Prefix?: Prefix) {
  const s3 = createS3();
  const filesResponse = s3
    .listObjectsV2({ Bucket, Prefix })
    .promise()
    .then((data) => data.Contents!.filter((item) => {
      const isFile = !item.Key!.endsWith('/')
      const isThumbnail = item.Key!.includes('@')
      return isFile && !isThumbnail
    }))
  return filesResponse
}

export async function s3UploadFile(fileUpload: AWSFileUpload) {
  const { uploadPath, fileBuffer, contentType } = fileUpload;
  const s3 = createS3();
  const uploadParams = {
    Bucket: s3.config.params!.Bucket,
    Key: uploadPath,
    Body: fileBuffer,
    ContentType: contentType,
  };
  const uploadResponse = s3
    .upload(uploadParams)
    .promise()
    .then((data) => {
      return data;
    });
  return uploadResponse;
}
