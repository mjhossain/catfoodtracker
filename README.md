# Cat Feeding Tracker

A simple kiosk web application for tracking cat feeding times and food colors.

## Features

- Record cat feedings with food color (red, blue, purple, or orange)
- View the last feeding time and food color
- See time elapsed since last feeding
- Scrollable feeding history showing up to 20 recent feedings

## Technologies Used

- Frontend: React, Tailwind CSS, and shadcn/ui components
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM (with fallback to in-memory storage)

## Running Locally

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- PostgreSQL database (optional - app will use in-memory storage if not available)

### Setup and Run

1. Clone this repository to your local machine
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Set up your PostgreSQL database (optional):
   - Create a new PostgreSQL database
   - Set the DATABASE_URL environment variable:

```bash
export DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

5. Start the application:

```bash
npm run dev
```

6. Access the application at:

```
http://localhost:5000
```

### Database Setup

The application can use either:
- PostgreSQL database (when DATABASE_URL is set)
- In-memory storage (when no DATABASE_URL is provided)

If using PostgreSQL, you can push the schema to your database with:

```bash
npm run db:push
```

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Running in Kiosk Mode

For optimal use on a tablet, set your tablet browser to kiosk mode or full-screen mode. The application UI is optimized for touch interaction and display on tablet-sized screens.