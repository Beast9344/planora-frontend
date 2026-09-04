# Planora — Frontend

A full-stack event management platform built with Next.js, enabling users to
discover, create, and participate in public and private events with integrated
payment and invitation workflows.

---

## 🔗 Live URLs

| Resource          | URL                                          |
| ----------------- | -------------------------------------------- |
| **Frontend Live** | https://planora-frontend-two.vercel.app      |
| **Backend Live**  | https://planora-backend.vercel.app           |
| **Frontend Repo** | https://github.com/asad9340/planora-frontend |
| **Backend Repo**  | https://github.com/asad9340/planora-backend  |

---

## 🛠️ Tech Stack

| Layer        | Technologies                       |
| ------------ | ---------------------------------- |
| Framework    | Next.js 16 (App Router) + React 19 |
| Language     | TypeScript                         |
| Styling      | Tailwind CSS v4 + shadcn/ui        |
| State / Data | TanStack Query v5                  |
| HTTP         | Axios (server + browser clients)   |
| Auth         | JWT cookies + Better Auth session  |
| Deployment   | Vercel                             |

---

## ✨ Features

- **Homepage** with Hero, Stats, Upcoming Events, How It Works, Features,
  Categories, Testimonials, and CTA sections
- **Secure Authentication** — Register, Login, Email OTP Verification, Google
  OAuth, Logout
- **Role-Based Access Control** — Admin and User dashboards with separate
  permissions
- **Event Management** — Create, edit, delete, and browse Public/Private,
  Free/Paid events
- **Invitation Workflow** — Send, accept, and decline invitations with real-time
  status
- **Participant Management** — Approve/reject join requests, track participant
  status
- **Payment Integration** — SSLCommerz-backed paid event registration
- **Reviews & Ratings** — Leave reviews after attending an event
- **Profile Management** — Update name and upload profile photo to Cloudinary
- **Admin Dashboard** — Overview stats, user management, event moderation
- **Fully Responsive** — Mobile-first design across all pages

---

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages and layouts
│   ├── (commonLayout)/    # Public pages (home, events, auth)
│   └── (dashboardLayout)/ # Protected dashboard pages
├── components/
│   ├── modules/           # Feature-specific components (Home, Event, Dashboard, Auth)
│   ├── shared/            # CommonNavbar, CommonFooter, etc.
│   └── ui/                # shadcn/ui base components
├── services/              # API service wrappers (server + client)
├── lib/                   # axios clients, auth utils, token utils, nav config
├── types/                 # App-wide TypeScript types
├── hooks/                 # Custom React hooks
└── zod/                   # Client-side form validation schemas
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

> Chatbot note: the floating assistant calls backend endpoint
> `/api/v1/chatbot/message`, so configure DeepSeek variables in backend `.env`.

### 3. Run development server

```bash
pnpm dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Start Next.js development server |
| `pnpm dev:turbo` | Start dev server with Turbopack  |
| `pnpm build`     | Production build                 |
| `pnpm start`     | Run production build             |
| `pnpm lint`      | Lint source files                |

---

## 👤 Admin Credentials (Demo)

| Field    | Value             |
| -------- | ----------------- |
| Email    | admin@planora.com |
| Password | Admin@123         |

---

## 🗂️ Dashboard Pages

- **My Events** — Manage events you created
- **Create Event** — Publish new public or private events
- **My Invitations** — View invitations sent to you
- **Pending Invitations** — Manage invites you have issued
- **Joined Events** — Events you have registered for
- **My Payments** — Payment history and receipts
- **My Reviews** — Reviews you have submitted
- **My Profile** — Update name and profile photo
- **Change Password** — Secure password update

## API Integration

Frontend communicates with backend via:

- Server HTTP client (for authenticated server components/actions)
- Browser HTTP client (for client-side requests)

Base path expected by services: `NEXT_PUBLIC_API_BASE_URL`

## Deployment Notes

- Set `NEXT_PUBLIC_API_BASE_URL` to deployed backend API URL.
- If backend callback redirects are used (payment), ensure backend
  `FRONTEND_URL` points to your deployed frontend domain.
