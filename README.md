# Developers Interview

A modern social networking and collaboration platform built exclusively for developers.

Developers Interview enables programmers to connect, build professional relationships, communicate in real time, create communities, and collaborate with fellow developers around the world.


## Overview

Developers Interview is a developer-focused networking platform where users can:

* Create professional developer profiles
* Send and accept friend requests
* Chat with friends in real time
* Create developer groups and communities
* Participate in group discussions
* Make voice/video calls
* Discover and connect with other developers
* Build meaningful professional relationships

The platform aims to provide a collaborative environment similar to modern social and communication platforms, tailored specifically for software developers.

---

# Tech Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* Zustand

## Authentication

* NextAuth.js v5
* Prisma Adapter
* Secure Session Management

## Database

* Supabase PostgreSQL

## Real-Time Features

* Socket.io
* Socket.io Client

## AI Integration

* Google Gemini API
* OpenAI API

## UI & Utilities

* Lucide React
* SweetAlert2
* Next Themes
* clsx
* tailwind-merge

---

# Features

## Authentication & Security

* User Registration
* User Login
* Secure Authentication
* Protected Routes
* Session Management
* Password Encryption using bcryptjs

---

## Developer Profiles

* Custom Profile Information
* Profile Picture
* Bio Section
* Skills & Technologies
* Social Links
* Developer Portfolio Links

---

## Friend System

* Send Friend Requests
* Accept Friend Requests
* Reject Friend Requests
* Remove Friends
* Friend Suggestions

---

## Real-Time Chat

* One-to-One Messaging
* Instant Message Delivery
* Online Status Indicators
* Typing Indicators
* Message History
* Real-Time Notifications

---

## Groups & Communities

* Create Developer Groups
* Join Groups
* Leave Groups
* Group Management
* Group Discussions
* Community Collaboration

---

## Voice & Video Calls

* One-to-One Calls
* Group Calls
* Incoming Call Notifications
* Real-Time Call Status

---

## Notifications

* Friend Request Notifications
* Message Notifications
* Group Activity Notifications
* Call Notifications

---

## AI Features

Integrated AI assistance using:

* Google Gemini
* OpenAI

Capabilities may include:

* Coding Assistance
* Bug Fix Suggestions
* Code Explanation
* Developer Productivity Tools

---

## Dark Mode

* Light Theme
* Dark Theme
* System Theme Detection

---

# Project Structure

```bash
developers-interview/
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
│
├── prisma/
│
├── package.json
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Fahmida0010/Developers-Interview-.git

cd Developers-Interview
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env.local` file and add:

```env
DATABASE_URL=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

GOOGLE_GENERATIVE_AI_API_KEY=


SUPABASE_URL=
SUPABASE_ANON_KEY=

SOCKET_SERVER_URL=
```

---

## Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# Build For Production

```bash
npm run build

npm run start
```

---

# Future Enhancements

* Developer Job Board
* Project Collaboration Spaces
* Repository Showcase
* Technical Blogging Platform
* Coding Challenges
* Screen Sharing During Calls
* Developer Events
* Open Source Contribution Hub

---

# Why Developers Interview?

Unlike traditional social platforms, Developers Interview focuses entirely on developers and technical collaboration.

The platform helps users:

* Build professional developer networks
* Find collaborators
* Share knowledge
* Communicate efficiently
* Grow their careers

---

# Author

Fahmida Akter Tanjina

Built with ❤️ using Next.js, Socket.io, Supabase, and NextAuth.


{Starting date= 6 April 2026
now working on coding..........}
