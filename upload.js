import dotenv from 'dotenv';
import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({      
    origin: 'http://localhost:5173',
}));


const port = 3002;


const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;

const s3Client = new S3Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });


app.post('/api/upload', async (req, res) => {
    const { fileName, fileType } = req.body;
  
    // const fileKey = `uploads/${Date.now()}-${fileName}`;  This will put , inside a folder
    const fileKey = `aws+${Date.now()}-${fileName}`;

    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: fileType,
    });
  
    try {
      const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      res.json({ uploadURL, fileKey });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  });



app.get("/", (req, res) => {    
    res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 





