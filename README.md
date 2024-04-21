## About the Project

Shadow Pay is a privacy preserving p2p transaction platform where only the parties directly involved have knowledge of the transfer details, i.e., the receiver's details is only known to the sender and the receiver

## Project Description

- The sender has the public key of the receiver.
- While sending the tokens, the underlying architecture encrypts the public key of the receiver off-chain using a random number and then creates a stealth address to which the tokens are deposited.
- Besides traditional EOA transfers, the sender can also transfer the tokens using his/her smart account address which is completely gasless in nature.
- The receiver has to sign in before he/she can view his/her received payments.
- Passkeys based sign in has been enabled to maintain more privacy
- The receiver can see all the funds received in the stealth address.
- The receiver has to attest that he has received the funds before withdrawing it.
- After attestation the receiver can withdraw the funds where the encrypted message is decrypted to obtain the receiver's public address where the tokens are finally withdrawn and deposited

## How it's made

Shadow Pay is made in order to maintain higher order privacy in p2p transfers. The sender and receiver only have the knowledge of the receiver's address. The sender has the public key of the receiver which is encrypted using crypto package before transfer of funds. Besides traditional EOA transfers, the user can also send out payments using his/her smart account address which is created using pimlico and gnosis. The details of the transfers are stored in lighthouse.storage .The receiver has to sign in before viewing all his received funds. The receiver has to attest the obtaining of the funds which is done using Sign protocol. After attesting, the receiver can withdraw the funds where the decoding of the encrypted message takes place and the tokens are withdrawn to the receiver's public address.



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
