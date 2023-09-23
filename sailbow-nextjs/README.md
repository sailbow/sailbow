This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running Sailbow

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


## Database migrations with Drizzle

Generate migration using ```npm run migration:generate```. This will create a migration file in ```src/app/db/migrations```

Execute migration using ```npm run migration:push```. Make sure the ```DATABASE_URL``` variable is set in your ```.env``` file

