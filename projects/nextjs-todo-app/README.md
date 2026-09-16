# Next.js Todo App

This is a simple to-do app built using Next.js and Next-Auth for authentication. The app allows users to create, update, and delete tasks. The app is deployed on Vercel and can be accessed at [https://nextjs-todo-app-ten.vercel.app/](https://nextjs-todo-app-ten.vercel.app/).

![taskKeeper](https://user-images.githubusercontent.com/85088804/232824199-c7ecb2db-b86b-4fe1-afb3-8dc772dd5ddf.png)

## Table of Contents

- [Next.js Todo App](#nextjs-todo-app)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
  - [Deployment](#deployment)
  - [Contributing](#contributing)

## Features

- User authentication using Next-Auth(credentials provider)
- CRUD (Create, Read, Update, Delete) operations for tasks
- Server-side rendering mixed with Client-side
- Responsive design using Tailwind CSS

## Technologies Used

- Next.js
- Next-Auth
- React
- Tailwind CSS
- Vercel

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/James-HPJ/nextjs-todo-app.git
```

2. Install dependencies:
```
cd nextjs-todo-app
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root of the project and add the following variables:
```
NEXTAUTH_SECRET=<YOUR SECRET FOR NEXTAUTH>
DB_USER=<MONGODB USERNAME>
DB_COLLECTION=<MONGODB COLLECTION NAME>
DB_PASSWORD=<MONGODB PASSWORD>
```

4. Run the development server:
```
npm run dev
```


Open your web browser and navigate to `http://localhost:3000` to access the app.

## Deployment

The app is deployed on Vercel, which provides an easy way to deploy Next.js apps. To deploy your own version of the app, follow these steps:

1. Create a Vercel account (if you don't have one already) at [https://vercel.com/](https://vercel.com/).

2. Install the Vercel CLI globally on your machine:

```
npm install -g vercel
```

3. Authenticate with Vercel by running:

```
vercel login
```

4. Deploy the app by running:
```
vercel  
```


Follow the prompts to configure your deployment settings, such as the project name, environment variables, etc.

5. Once the deployment is complete, you will receive a URL for your deployed app. You can access the app using that URL.

## Contributing

If you would like to contribute to this project, feel free to submit a pull request or open an issue. Contributions are welcome!




