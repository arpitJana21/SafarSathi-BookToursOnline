# SafarSathi: Book Tour Online

<p align="center">
  <a href="" rel="">
 <img height=150px style="border-radius:0.3rem" src="https://i.postimg.cc/13ZMc49z/p1.png"></a>
</p>
<div align="center">
<h4>
SafarSathi is your hassle-free online tour booking REST-API. It offers user-friendly features like secure registration, profile management, and effortless tour exploration. With a location-based search and secure payment processing, it's the go-to platform for travelers. Admins enjoy a powerful dashboard for seamless management.</h4>

[![Repo Type](https://img.shields.io/badge/repo_type-Public-fcc419?style=flat&link=https://github.com/arpitjana21/SafarSathi-BookToursOnline)](https://github.com/arpitjana21/SafarSathi-BookToursOnline)
[![Inline docs](https://inch-ci.org/github/dwyl/hapi-auth-jwt2.svg?branch=master)](https://documenter.getpostman.com/view/25970142/2s9Y5YRN2L)
![version](https://img.shields.io/badge/npm-v9.5.0-red)
![version](https://img.shields.io/badge/node-v18.15.0-green)
[![License](https://img.shields.io/badge/license-MIT-85e2cd.svg)](https://opensource.org/license/mit/)

## </div>

## Table of Contents

-   [Tech & Tools](#Tech-&-Tools)
-   [Getting Started](#Getting-Started)
-   [API Features](#API-Features)
-   [API Documentation](#API-Documentation)
-   [Entity Relationship Diagram](#Entity-Relationship-Diagram)
-   [Contact Me](#Contact-Me)

## Tech & Tools

![Tech Stack](https://skillicons.dev/icons?i=nodejs,expressjs,mongodb,pug)

![Dev Tools](https://skillicons.dev/icons?i=vscode,git,github,postman)

## Getting Started

**Step 1** : Install `npm packages`

```
npm install
```

**Step 2** : Create a `config.env` file with following variables

```
PORT=8000
USER={{YourUsername}}
DATABASE_PASSWORD={{YourDatabasePassword}}
DATABASE={{YourMongoDBConnectionURL}}
DATABASE_LOCAL={{YourLocalMongoDBConnectionURL}}

JWT_SECRET={{YourJWTSecretKey}}
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES=90

EMAIL_USERNAME={{YourEmailUsername}}
EMAIL_PASSWORD={{YourEmailPassword}}
EMAIL_HOST={{YourEmailHost}}
EMAIL_PORT={{YourEmailPort}}
EMAIL_FROM={{YourEmailFrom}}

NODE_ENV=production
STRIPE_SECRET_KEY={{YourStripeSecretKey}}
```

**Step 3** : Must have VS-Code Extentions

```
1. Prettier-Code formatter
2. ESLint
```

**Step 4** : Finally

Run on *DEVELOPMENT : `npm run dev`\
Run on *PRODUCTION : `npm start`

```
// Output :
API URL: {{PROTOCOL}}://{{HOST}}:{{PORT}}/api/v1/
e.g.
*PROTOCOL = http
*HOST = 127.0.0.1
*PORT = 8000
*API URL = http://127.0.0.1:8000/api/v1/
```

## API Features

#### User and Admin Management:

1. Secure User Registration and Authentication
2. User and Admin Login/Logout
3. Profile Updates and Image Upload
4. Forgotten Password Recovery
5. Password Reset
6. Get Password Reset Emails
7. Welcome Email upon Signup

#### Tour Exploration:

1. Browse and Retrieve All Tours with Pagination
2. Filter Tours Based on Preferences
3. Search Tours with Ease
4. Sort Tours for Convenience
5. Discover Tours in Specific Location Radius
6. Get Tour Statistics
7. Monthly Plan Access

#### Enhanced User Experience:

1. Write and Read Tour Reviews
2. Booking Creation with Secure Payment Processing (via Stripe)

#### Admin Empowerment:

1.  Admin Dashboard for Full Control
2.  CRUD Operations for Tours, Users, Reviews, and Bookings

**SafarSathi** is your trusted companion for planning and booking tours effortlessly. We understand the importance of security and user-friendliness, which is why we offer features like forgotten password recovery, password reset, and email notifications to keep your data safe and your experience smooth. Whether you're an adventurous traveler or a meticulous tour organizer, our API provides the tools you need to create, manage, and enjoy memorable journeys. Unlock the world of travel possibilities with SafarSathi today!

## API Documentation

An Interactive API Documentation Covering All Routes with Detailed Request and Response Examples.

<a href="https://documenter.getpostman.com/view/25970142/2s9Y5YRN2L">![version](https://img.shields.io/badge/API_Documentation-View_Here-0E89C6)</a>

#### How to test API in Postman ?

1. Click "Run in Postman" inside the docs.
2. Import Collection inside your workspace.
3. Inside Environments tab create new Environment, name it as "SafarSathi".
4. Inside the Environment create new Variables-\
   &nbsp; "URL" ~ "https://safarsathi-booktoursonline-production.up.railway.app" \
   &nbsp; "jwt" ~ "No-Initaial-Value-Required"
5. Now your Environment is ready to use.
6. Before trying any Route select the Environment "SafarSathi".
7. ✅ Now you are ready to Exprerience the API.

<a href="https://documenter.getpostman.com/view/25970142/2s9Y5YRN2L" target="_blank" rel="">
<img src="/public/img/readme/docs.png">
</a>

## Entity Relationship Diagram

<img src="/public/img/readme/ERD.jpg">

## Contact Me

[![GitHub ](https://img.shields.io/badge/GitHub-@arpitjana21-orange?style=flat&logo=GitHub&link=https://github.com/arpitjana21)](https://github.com/arpitjana21)
[![LinkedIn ](https://img.shields.io/badge/LinkedIn-@arpitjana2103-0077b5?style=flat&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/arpitjana2103/)](https://www.linkedin.com/in/arpitjana2103/)

## LISENSE

[![License](https://img.shields.io/badge/license-MIT-85e2cd.svg)](https://opensource.org/license/mit/)

Copyright (c) 2023 Arpit Jana
