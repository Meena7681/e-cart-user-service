import { S3 } from "aws-sdk";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuid } from "uuid";

const S3Client = new S3();

export const imageUploader = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // grab the fileName from the queryString
  const file = event.queryStringParameters?.file;
  // give unique name of the file
  const fileName = `${uuid()}__${file}`;
  // create S3Params
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    key: fileName,
    ContentType: "image/jpeg",
  };
  // create Signed URL
  const url = await S3Client.getSignedUrlPromise("putObject", s3Params);
  console.log("UPLOAD URL:", s3Params, url);

  //  give to back to client for upload

  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
      key: fileName,
    }),
  };
};
