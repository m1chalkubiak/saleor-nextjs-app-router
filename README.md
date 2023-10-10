![Next.js App Router + Saleor](https://user-images.githubusercontent.com/44495184/210545042-0537d49f-6ab8-4e52-af75-225370789c2b.png)

<img width="1383" alt="Saleor Example: Next.js 13 App Router Starter" src="https://github.com/saleor/example-nextjs-app-router-starter/assets/200613/2de5b286-a05c-4eee-9591-b4b01c3c7ee7">

<div align="center">
  <h1>Next.js (App Router) applications with Saleor.</h1>
</div>

<div align="center">
  <p>Implementing checkout using the new Nextjs app router approach.</p>
</div>

## Stack:

- [Next.js App Router](https://nextjs.org/) with static data fetching
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)

## Quickstart

1. Create a new repository from this template ("Use this template")
2. Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Replace the `SALEOR_API_URL` environment variable with the address of your Saleor instance.

4. Install the dependencies:

```bash
pnpm i
```

5. Generate the types based on GraphQL schema:

```bash
pnpm generate
```

6. Start the development server:

```bash
pnpm dev
```

7. Enjoy! 🎉
