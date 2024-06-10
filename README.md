# [MyDent](https://dent.paulgeorge.dev)

MyDent is a web application (created using [T3 Stack](https://create.t3.gg/)) designed to help dentist offices manage patients appointments and documents.

- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Shadcn/UI](https://ui.shadcn.com/) Special thanks to **shadcn**!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- bun package manager (v1.1.0 or later)

### Installation

Clone the repository:
`git clone https://github.com/paulgeorge35/dent.git`

### Install the dependencies:

```
cd dent
bun install
```

### Set up an OAuth app in the Google Cloud Console.

### Create a .env file in the root directory of the project and add your environment variables:

```
DATABASE_URL="your_prisma_accelerate_database_url"
DIRECT_DATABASE_URL="your_database_url"
AUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="your_nextauth_url"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="/api/auth/callback/google"
RESEND_API_KEY="re_key"
```

Make sure you update **env.js** file in case you add new environment variables.

### Run Prisma commands:

```
bunx prisma db push
bunx prisma db seed
```

### Run the development server:

```
bun --bun run dev
```

### Now, the application should be running at http://localhost:3000.

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.

### Contact

Paul George - contact@paulgeorge.dev

Project Link: https://github.com/paulgeorge35/dent
