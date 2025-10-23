# Shopping List App

A simple shopping list application built with Next.js.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the `main` branch
3. Go to your repository Settings > Pages
4. Under "Build and deployment", select "GitHub Actions" as the source
5. The GitHub Actions workflow will automatically deploy your app to GitHub Pages
6. Your app will be available at `https://<username>.github.io/shopping-list-app`

### Manual Deployment

If you want to deploy manually:

1. Install required dependencies:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Run the build and deploy:
   ```bash
   npm run deploy
   ```

## Features

- Add, edit, and delete shopping list items
- Adjust item quantities
- Mark items as completed
- Mobile-friendly design

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
