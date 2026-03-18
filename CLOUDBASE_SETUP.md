# CloudBase Setup

## 1. Create a CloudBase Environment

1. Open Tencent Cloud CloudBase Console.
2. Create an environment in Mainland China, for example `ap-shanghai`.
3. Record the environment ID, region, client ID, and public access key.

## 2. Enable Email Authentication

1. Open the authentication section in CloudBase.
2. Enable email/password login.
3. Configure the email verification flow so registration emails can be sent normally.

## 3. Create Database Collection

Create a collection named:

`learning_records`

Suggested fields:

- `userId`
- `wordId`
- `interval`
- `easeFactor`
- `nextReviewDate`
- `repetitions`
- `lastReviewedAt`

Recommended permission:

- only the creator can read and write their own documents

## 4. Add Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_TCB_ENV_ID=your-cloudbase-env-id
NEXT_PUBLIC_TCB_REGION=ap-shanghai
NEXT_PUBLIC_TCB_CLIENT_ID=your-cloudbase-client-id
NEXT_PUBLIC_TCB_ACCESS_KEY=your-cloudbase-public-access-key
```

## 5. Local Run

```bash
npm install
npm run dev
```

## 6. Deploy in Mainland China

Recommended options:

- CloudBase Hosting
- Tencent Cloud EdgeOne Pages
- Tencent Cloud Lighthouse or CVM + Node.js

For Mainland China production use, bind a filed and ICP-compliant domain.
