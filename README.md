# Users ans Posts Management App

A Next.js application that allows users to view, search, and sort user data and view the users post. The app includes a loading state management system to show a loader while data is being fetched and supports sorting and filtering.

## Features

- **User Data Display**: Fetches user data from an external API and displays it in a table format.
- **Search Functionality**: Search users by name with a debounced search input.
- **Column Sorting**: Sort users by any column in ascending or descending order.
- **Loading State**: Shows a loading indicator while data is being fetched.
- **User Posts Display**: Fetches user posts data from an external API and displays it in a card view.

## Technologies Used

- **Next.js** (with TypeScript) for the framework and routing.
- **React** for the frontend UI components.
- **Context API** for global state management (loading indicator).
- **Tailwind CSS** for styling.
- **Lodash** for debounced search functionality.

## Getting Started

Install dependencies

```bash
npm install
```

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
