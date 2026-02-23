# Tars Chat

A real-time one-on-one chat application built with Next.js, Convex, and Clerk.

## Tech Stack

- **Next.js 15** – React framework
- **Convex** – Real-time backend & database
- **Clerk** – Authentication
- **Tailwind CSS** – Styling

## Prerequisites

Before running this project you need accounts on:

- [Convex](https://convex.dev) – for the real-time backend
- [Clerk](https://clerk.com) – for authentication

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dikshant1408/Tars-Full-stack-Engineer-Internship-Coding-Challenge.git
cd Tars-Full-stack-Engineer-Internship-Coding-Challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder values:

```env
# Clerk Authentication – https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex – https://dashboard.convex.dev
NEXT_PUBLIC_CONVEX_URL=https://xxxxxxxx.convex.cloud
CONVEX_DEPLOYMENT=dev:xxxxxxxx
```

#### How to get your Clerk keys

1. Sign in to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or open an existing one)
3. Go to **API Keys** and copy the **Publishable Key** and **Secret Key**

#### How to get your Convex URL

1. Sign in to [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project (or open an existing one)
3. Run `npx convex dev` once – it will create a `.env.local` entry for `CONVEX_DEPLOYMENT` and print your `NEXT_PUBLIC_CONVEX_URL`

### 4. Run the Convex backend

In a separate terminal, start the Convex development server:

```bash
npx convex dev
```

### 5. Start the Next.js development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # Reusable React components
│   └── providers/ # Context providers (Convex, Clerk)
└── lib/           # Utility functions and constants
convex/            # Convex backend schema and functions
```

## Troubleshooting

### "Configuration Error – Missing required environment variables"

This error appears when `NEXT_PUBLIC_CONVEX_URL` or `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set.

**Fix:** Follow [step 3](#3-set-up-environment-variables) above to create your `.env.local` file, then restart the development server.
