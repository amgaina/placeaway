# Placeaway - AI-Powered Trip Planner

A modern travel planning application that uses AI to create personalized trip itineraries and provide real-time travel assistance.

## Features

- 🧠 AI-powered trip suggestions
- 💬 Interactive chat interface for trip refinement
- 📅 Dynamic itinerary planning
- 💰 Budget tracking and management
- 🗺️ Travel recommendations
- 👥 Multi-user support
- 🔐 Secure authentication

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form & Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Deepseek API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/placeaway.git

# Install dependencies
cd placeaway
npm install

# Setup environment variables
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma db push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Test Users

After seeding the database, you can use these accounts to test the application:

```
Admin User:
Email: admin@placeaway.com
Password: Admin@123456

Regular Users:
1. Email: john.doe@example.com
    Password: User@123456

2. Email: jane.smith@example.com
    Password: User@123456

3. Email: robert.wilson@example.com
    Password: User@123456
```
