# Upload Images to S3

A simple Node.js and React project for uploading images to an Amazon S3 bucket. This project demonstrates secure handling of AWS credentials and environment variables.

## Features

- Upload images directly to AWS S3.
- Uses `.env` files for managing environment-specific variables.
- Prevents secrets from being committed to the repository.

## Folder Structure

```
project-root/
├── react-app/
├── uploadtoS3/
│   ├── .env          # Contains AWS secrets (not committed to Git)
│   ├── .gitignore    # Specifies files to ignore for Git
│   └── src/          # Application source code
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm installed.
- An AWS account with access to an S3 bucket.

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ichiragkumar/UploadImagesTos3.git
   cd UploadImagesTos3
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the `uploadtoS3/` directory with the following contents:

   ```env
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=your-region
   S3_BUCKET_NAME=your-bucket-name
   ```

4. **Add ****`.env`**** to ****`.gitignore`**
   Ensure `.env` is ignored to prevent committing secrets:

   - In `uploadtoS3/.gitignore`:
     ```
     .env
     ```
   - At the root level, ensure `.gitignore` also includes:
     ```
     uploadtoS3/.env
     ```

5. **Remove ****`.env`**** from Git History**
   If `.env` was accidentally committed, remove it:

   ```bash
   git rm --cached uploadtoS3/.env
   git commit -m "Remove .env from version control"
   git push origin main --force
   ```

   If you need to completely purge it from history, use:

   ```bash
   bfg --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin main --force
   ```

## Usage

1. **Start the Application**
   Navigate to `uploadtoS3/` or `react-app/` and run:

   ```bash
   npm start
   ```

2. **Upload Images**
   Follow the interface prompts to upload images to your configured S3 bucket.

## Security Considerations

- **Do not hardcode secrets** in your code.
- Use a secret manager like AWS Secrets Manager for production.
- Rotate AWS credentials periodically.
