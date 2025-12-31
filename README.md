# Sus-Technology AI App Builder Dashboard

Enterprise-grade SaaS dashboard for **Sus-Technology.com**, an AI-powered mobile app builder platform.  
Built with performance, scalability, and clean architecture in mind.  
Frontend-only. Backend-ready.

---

## 🚀 Overview

This project is a **production-ready React dashboard** designed for enterprise clients.  
It includes secure authentication, protected routes, and a fully responsive dashboard with **8 core sections** for app management, analytics, collaboration, and system administration.

The architecture is clean, scalable, and optimized for future API integration.

---

## 🧱 Tech Stack (Strict)

- **React.js** with **Vite**
- **React Router v6**
- **Context API** for Authentication
- **Tailwind CSS**
- **Framer Motion** (performance-safe animations)
- **JWT-ready authentication logic** (mock / Firebase / API-ready)

---

## 🎨 Design System

### Color Palette (Light Theme Only)

| Purpose | Color |
|------|------|
| Primary | `#66B0EE` |
| Secondary | `#CDAFF5` |
| Gradient | `#66B0EE → #CDAFF5` |
| Background | `#FFFFFF` |
| Surface | `#F6F7FB` |
| Text Primary | `#24252F` |
| Text Secondary | `#3E3E4B` |

### Typography (Strict)

- **Headings**: Baumans
- **Body / Forms / Buttons / Tables**: Poppins

---

## 🔐 Authentication Flow

- **Signup**
  - Create user
  - Store JWT token
  - Redirect to dashboard

- **Login**
  - Validate credentials
  - Store JWT token
  - Redirect to dashboard

- **Logout**
  - Clear token
  - Redirect to login

- **Route Protection**
  - Token check on every protected route
  - Unauthenticated users always redirected to `/login`

JWT logic is mock-based but **API-ready**.

---

## 🧭 Dashboard Sections (Exactly 8)

1. **Overview**
   - Total apps created
   - Active apps
   - Recent activity snapshot
   - Primary CTA: Create New App  
   - Animations: card fade + slide-up, number count-up

2. **My Apps**
   - App list
   - Status (Draft / Live)
   - Last updated
   - Edit / View actions  
   - Animations: row hover highlight, new app slide-in

3. **Templates**
   - Categories: E-commerce, Chat, Booking, Dashboard
   - Template selection  
   - Animations: hover scale (max 1.02), soft primary highlight

4. **App Builder**
   - Screen list panel
   - Component canvas
   - Settings side panel  
   - Animations: settings panel slide-in, component snap

5. **Analytics**
   - Users count
   - Usage metrics
   - Charts with mock data  
   - Animations: chart draw-in, tooltip fade

6. **Collaboration**
   - Team members
   - Roles
   - Recent actions  
   - Animations: new member slide-in, online pulse only

7. **Settings**
   - Profile update
   - Password change
   - Preferences
   - Logout  
   - Animations: toggle switch, success toast slide-in

8. **Activity & Logs**
   - App creation logs
   - Template usage
   - Team actions
   - Login activity  
   - Animations: log slide-down, expandable details

---

## 🧩 Layout Architecture

### Header
- Fixed position
- Height: **64px**
- Always visible
- Mobile sidebar toggle
- Page title
- User avatar
- Logout button

### Sidebar
- Desktop: always visible
- Tablet: collapsible
- Mobile: hidden by default, slide-in drawer with overlay
- Active route highlighting
- Icons + labels

### Content Area
- Only section that scrolls
- No horizontal scrolling
- No layout shift

---

## 📱 Responsive Rules

- Desktop: sidebar always visible
- Tablet: sidebar collapsible
- Mobile: sidebar hidden by default
- Header always fixed
- Main content scroll only

---

## 🎞️ Animation Rules (Strict)

- Duration: **150–250ms**
- Timing: **ease-out only**
- No infinite animations
- No decorative motion
- Performance-first

---

## 📁 Folder Structure (Mandatory)

```txt
src/
├── auth/
│    ├── Login.jsx
│    ├── Signup.jsx
│    ├── AuthContext.jsx
├── layout/
│    ├── Sidebar.jsx
│    ├── Header.jsx
│    ├── DashboardLayout.jsx
├── pages/
│    ├── Overview.jsx
│    ├── MyApps.jsx
│    ├── Templates.jsx
│    ├── AppBuilder.jsx
│    ├── Analytics.jsx
│    ├── Collaboration.jsx
│    ├── Settings.jsx
│    ├── ActivityLogs.jsx
├── components/
│    ├── ProtectedRoute.jsx
├── App.jsx
└── main.jsx

---

## ⚙️ Installation & Setup

bash
Copy code
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
