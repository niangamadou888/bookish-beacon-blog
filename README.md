
# BookBlog - MERN Stack Blog Application

A full-stack blog application about books built with the MERN (MongoDB, Express, React, Node.js) stack.

## Features

- User authentication (login/register) with JWT
- Create, read, update, and delete blog posts
- Protected routes for authenticated users
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React
- TypeScript
- React Router for navigation
- React Query for data fetching
- React Hook Form + Zod for form validation
- Tailwind CSS and shadcn/ui for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose for database operations
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd bookblog
```

2. Install dependencies for both frontend and backend:
```
npm install
```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Update the MongoDB connection string and JWT secret

4. Start the development servers:

For the frontend:
```
npm run dev
```

For the backend:
```
cd server
node server.js
```

5. The frontend should now be running at http://localhost:8080 and the backend at http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Blog Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (requires authentication)
- `PUT /api/posts/:id` - Update a post (requires authentication)
- `DELETE /api/posts/:id` - Delete a post (requires authentication)

## Project Structure

```
/
├── src/                  # Frontend source files
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── server/               # Backend source files
│   ├── server.js         # Express server setup
│   └── .env.example      # Example environment variables
└── README.md             # Project documentation
```

## Future Enhancements

- Comment system for blog posts
- User profiles
- Image upload functionality
- Search and filtering capabilities
- Categories and tags for posts
