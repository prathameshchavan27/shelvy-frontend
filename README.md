# Shelvy

A modern warehouse inventory management system built with React and TypeScript.

![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

## Overview

Shelvy is a frontend application for managing warehouse inventory, products, and stock movements. It provides an intuitive interface for tracking inventory across multiple warehouse locations with role-based access control.

## Features

- **Authentication** — Secure login and signup with JWT-based authentication
- **Role-Based Access** — Different permissions for staff and admin users
- **Inventory Management** — Track stock levels across warehouse storage locations
- **Product Catalog** — Manage product information with SKU tracking
- **Bundles** — Group products into bundles for easier management
- **Receiving** — Handle incoming inventory shipments
- **Multi-Warehouse Support** — Switch between different warehouse contexts

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Routing | React Router v7 |
| HTTP Client | Axios |
| UI Components | Radix UI |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:4000`

### Installation

1. Clone the repository:
 ```bash
   git clone <repository-url>
   cd shelvy-frontend
 ```

2. Install dependencies:
 ```bash
   npm install
 ```

3. Start the development server:
 ```bash
   npm run dev
 ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── api/              # API client and endpoint functions
│   ├── auth.ts       # Authentication endpoints
│   ├── client.tsx    # Axios instance with interceptors
│   ├── inventory.ts  # Inventory endpoints
│   └── product.ts    # Product endpoints
├── assets/           # Static assets and logos
├── components/       # Reusable UI components
│   ├── navbar/       # Navigation components
│   └── ...
├── context/          # React context providers
├── features/         # Feature-specific modules
├── layouts/          # Page layout components
├── pages/            # Route page components
├── routes/           # Route configuration and guards
└── store/            # Zustand state stores
```

## API Configuration

The application expects a backend API at `http://localhost:4000/api/v1`. To modify this:

1. Open `src/api/client.tsx`
2. Update the `baseURL` in the axios instance

## Authentication

The app uses JWT tokens stored in localStorage. The auth flow includes:

- Automatic token attachment to all API requests
- Automatic redirect to login on 401 responses
- Role-based UI rendering for staff vs admin users

## 🔗 Related Repositories
This project is part of the Shelvy Warehouse Ecosystem:
*   [Shelvy Backend](https://github.com/prathameshchavan27/shelvy-backend) - Core API and Database logic.

## License

MIT
