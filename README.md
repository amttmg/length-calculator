# Feet & Inch Length Calculator

A modern mobile-first web app built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Features

- Add feet + inch measurements
- Subtract feet + inch measurements
- Divide a length by a number
- Inputs for feet and decimal inches
- Automatic inch normalization above 12
- Clean dark mobile UI with large calculator-style controls
- Real-time result display
- Validation for invalid inputs
- Installable PWA support
- Vercel-ready deployment

## Project Structure

- `app/` - App Router pages and global styling
- `components/` - UI components like `LengthInput`, `OperationSelector`, `ResultCard`, and `CalculatorPage`
- `public/` - Manifest and PWA icon assets

## Run locally

1. Use Node.js 18 or later.

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open the app at:

```bash
http://localhost:3000
```

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create a new project on Vercel and connect your repo.
3. Set the framework preset to `Next.js`.
4. Vercel will automatically detect the build command:

```bash
npm run build
```

No additional configuration is required.

## Notes

- The app is built as a single-page experience using the App Router.
- The PWA manifest and SVG icons enable installable behavior on supported devices.
