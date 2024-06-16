
# Trello Clone project
Created for the purpose of learning fullstack development with some features such as authentication, drag and drop and other features that this course can offer. I followed the course of Code with Antonio and build it from start to finish.

## Technology

- Next.js
- Typescript
- Clerk 
- Prisma 

## Get the project running

Follow this step by step guide to start running the project

1. Here's the format for the environment variables (.env)
```.env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = 
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = 

# Prisma database url, this supports as what prisma can such as: Mysql, PostgresSQl, MongoDB
DATABASE_URL=
```

2. Setup the [clerk](https://clerk.com/) for authentication setup

3. Setup prisma with mongo database and run this code block to copy the model to the database in mongo
```
 npx prisma generate
```