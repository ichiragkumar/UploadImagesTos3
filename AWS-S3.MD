## AWS S3 Setup

### Step 1: Create an S3 Bucket

1. Go to the [AWS Management Console](https://aws.amazon.com/console/).
2. Open the S3 service.
3. Click **Create bucket** and configure the following:
   - **Bucket name**: Choose a unique name.
   - **Region**: Select your preferred region.
   - Leave other settings as default for now.
4. Click **Create bucket**.

### Step 2: Configure Bucket Policy

Create a policy to allow access to your bucket.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

Replace `your-bucket-name` with your actual bucket name.

1. Go to the **Permissions** tab of your bucket.
2. Click **Edit** on **Bucket policy**.
3. Paste the policy and save.

### Step 3: Set Up CORS Configuration

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedOrigins": ["*"]
  }
]
```

1. Under **Permissions**, find **CORS configuration**.
2. Click **Edit** and paste the configuration.
3. Save changes.

### Step 4: Create an IAM User and Assign Policy

1. Go to the [IAM Console](https://console.aws.amazon.com/iam/).
2. Click **Users** > **Add users**.
3. Name the user (e.g., `s3-upload-user`) and enable **Programmatic access**.
4. Attach the policy:
   - Choose **Attach existing policies directly**.
   - Select **AmazonS3FullAccess**.
5. Complete the creation and download the access key credentials.

### Step 5: Use Access Keys in `.env`

Copy the keys into your `.env` file:

```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## Generating and Using a Signed URL

### Why Use a Signed URL?

A signed URL allows secure, temporary access to S3 resources without exposing your secret credentials in the client application.

### Dependencies

1. **dotenv**: Loads environment variables from a `.env` file into `process.env`.
   - Install: `npm install dotenv`
   - Import: `import dotenv from 'dotenv';`
2. **express**: A minimal Node.js framework for handling server-side routing.
   - Install: `npm install express`
   - Import: `import express from 'express';`
3. **@aws-sdk/client-s3**: AWS SDK for JavaScript to interact with S3.
   - Install: `npm install @aws-sdk/client-s3`
   - Import: `import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';`
4. **@aws-sdk/s3-request-presigner**: Generates presigned URLs.
   - Install: `npm install @aws-sdk/s3-request-presigner`
   - Import: `import { getSignedUrl } from '@aws-sdk/s3-request-presigner';`
5. **cors**: Handles Cross-Origin Resource Sharing.
   - Install: `npm install cors`
   - Import: `import cors from 'cors';`

### Generating a Signed URL

```javascript
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const generateSignedUrl = async (fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: 'image/jpeg'
  };
  return getSignedUrl(s3Client, new PutObjectCommand(params), { expiresIn: 60 });
};
```

### Uploading with the Signed URL

Make a `PUT` request from the frontend:

```javascript
fetch(signedUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'image/jpeg'
  },
  body: file
});
```

### Confirming the Upload

You can confirm if the file was uploaded by listing objects in your bucket:

```javascript
const listObjects = async () => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME
  };
  const data = await s3Client.send(new ListObjectsCommand(params));
  console.log(data);
};
```

## Flowchart Overview

1. **Frontend**: User selects a file.
2. **Backend**: Generates a signed URL using AWS SDK.
3. **Frontend**: Uses the signed URL to upload the file.
4. **AWS S3**: Stores the file.
5. **Confirmation**: Backend lists objects or confirms success.

Flowchart illustration:

```
[User] -> [Frontend App: Request Signed URL] -> [Backend: Generate Signed URL]
[Backend] -> [AWS S3: Signed URL for PUT]
[User] -> [Upload File using Signed URL] -> [AWS S3]
```

