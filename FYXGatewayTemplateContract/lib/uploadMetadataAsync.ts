import { Blob } from 'node:buffer';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from 'axios';

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY || '',
    secretAccessKey: process.env.FILEBASE_SECRET_KEY || '',
  },
  endpoint: 'https://s3.filebase.com',
  region: 'us-east-1',
  apiVersion: 'v4'
});

export interface Attribute {
  trait_type: string;
  value: number | string;
  display_type?: string;
}

export interface RawMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  background_color: string;
  entity: string;
  attributes: Attribute[];
  rarity?: string;
}

export const uploadMetadataAndGetCIDsWithFileBase = async (assets: any[]) => {
  const promises = assets.map(async (gameItem) => {
    let cid = ''

    // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    // https://docs.filebase.com/code-development-+-sdks/sdk-examples-pinning-files-and-folders-to-ipfs/aws-sdk-for-javascript
    // https://www.infura.io/blog/post/how-to-create-an-nft-with-infura
    
    const resImage = await axios.get(gameItem?.image, {
      responseType: 'arraybuffer'
    })

    
    // --==Upload image to S3==--
    const command = new PutObjectCommand({
      Bucket: process.env.FILEBASE_BUCKET,
      Key: `${gameItem?.name}.png`,
      Body: Buffer.from(resImage?.data),
      Metadata: {}
    });

    command.middlewareStack.add(
      (next: any) => async (args: any) => {
        // Check if request is incoming as middleware works both ways
        const response: any = await next(args);
        if (!response?.response?.statusCode) return response;

        // Get cid from headers
        cid = response?.response?.headers["x-amz-meta-cid"];
        return response;
      },
      {
        step: "build",
        name: "addCidToOutput",
      },
    );

    const res = await client.send(command);
    // --==Upload image to S3==--

    // --==Upload Metadata json to S3==--
    
    const str = JSON.stringify(gameItem, null, 2);
    const blob:any = new Blob([str], { type: 'application/json' });
    const arrayBuffer = await blob.arrayBuffer()
    

    const commandMetadata = new PutObjectCommand({
      Bucket: process.env.FILEBASE_BUCKET,
      Key: `${gameItem?.name}.json`,
      Body: Buffer.from(arrayBuffer, "binary"),
      Metadata: {}
    });

    commandMetadata.middlewareStack.add(
      (next: any) => async (args: any) => {
        // Check if request is incoming as middleware works both ways
        const response: any = await next(args);
        if (!response?.response?.statusCode) return response;

        // Get cid from headers
        cid = response?.response?.headers["x-amz-meta-cid"];
        return response;
      },
      {
        step: "build",
        name: "addCidToOutput",
      },
    );

    const resMetadata = await client.send(commandMetadata);
    // --==Upload Metadata json to S3==--

    return `https://ipfs.filebase.io/ipfs/${cid.toString()}`;
  });

  return await Promise.all(promises);
};
