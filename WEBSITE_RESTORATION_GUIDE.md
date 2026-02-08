# Website Restoration Guide

## 🚨 Issue Identified
The website is missing the `axios` dependency which is required for API calls. This is causing the booking and contact features to fail.

## 🔧 Quick Fix Steps

### 1. Install Missing Dependencies
```bash
cd Frontend
npm install axios
```

### 2. Start All Services
```bash
# Terminal 1 - Backend Server
cd Backend
node index.js

# Terminal 2 - Frontend Server  
cd Frontend
npm run dev
```

### 3. Setup Database Tables (if not done)
```bash
# From root directory
node run_setup.js
node setup_booking_tables.js  
node setup_contact_feature.js
```

## 📋 Website Structure Check

### ✅ Components Present:
- **App.vue** - Main app layout with navbar and footer
- **AppNavbar.vue** - Navigation menu
- **AppFooter.vue** - Footer component
- **ContactModal.vue** - Contact form modal
- **BookingModal.vue** - Booking form modal

### ✅ Pages Present:
- **HomeView.vue** - Landing page
- **AboutView.vue** - About page
- **ContactView.vue** - Contact page
- **TutorsView.vue** - Public tutor listing
- **StudentDashboardView.vue** - Student dashboard with tutors
- **StudentTutorsView.vue** - Advanced tutor search
- **AdminTutorsView.vue** - Admin tutor management
- **LoginView.vue** - Login page
- **SignUpView.vue** - Student signup
- **AdminSignUpView.vue** - Admin signup

### ✅ Features Working:
- **Navigation** - Full navbar with routing
- **Authentication** - Login/signup system
- **Tutor Display** - Show tutors from admin panel
- **Booking System** - Complete booking functionality
- **Contact System** - Message tutors feature
- **Admin Panel** - Manage tutors and students
- **Responsive Design** - Mobile-friendly layout

## 🎯 Complete Website Features

### Public Pages:
1. **Home** (`/`) - Landing page with hero section
2. **About** (`/about`) - About the platform
3. **Contact** (`/contact`) - Contact information
4. **Tutors** (`/tutors`) - Browse available tutors

### Authentication:
5. **Login** (`/login`) - Student/admin login
6. **Student Signup** (`/signup`) - Create student account
7. **Admin Signup** (`/admin-signup`) - Create admin account

### Student Features:
8. **Student Dashboard** (`/student/dashboard`) - View tutors, book sessions, contact tutors
9. **Student Tutors** (`/student/tutors`) - Advanced tutor search with filters
10. **Student Calendar** (`/student/calendar`) - View booked sessions

### Admin Features:
11. **Admin Dashboard** (`/admin/dashboard`) - Admin overview
12. **Admin Tutors** (`/admin/tutors`) - Manage tutors
13. **Admin Students** (`/admin/students`) - Manage students
14. **Admin Courses** (`/admin/courses`) - Manage courses
15. **Admin Grades** (`/admin/grades`) - Manage grades

### Teacher Features:
16. **Teacher Availability** (`/teacher/availability`) - Set availability

## 🔄 Testing the Full Website

### 1. Public Access (No Login Required)
- Visit `http://localhost:5173/` - Home page
- Visit `http://localhost:5173/about` - About page
- Visit `http://localhost:5173/contact` - Contact page
- Visit `http://localhost:5173/tutors` - Browse tutors

### 2. Student Flow
- Go to `http://localhost:5173/signup` - Create student account
- Login at `http://localhost:5173/login`
- Access student dashboard at `http://localhost:5173/student/dashboard`
- Test contacting tutors
- Test booking sessions

### 3. Admin Flow
- Go to `http://localhost:5173/admin-signup` - Create admin account
- Login at `http://localhost:5173/login`
- Access admin dashboard at `http://localhost:5173/admin/dashboard`
- Add tutors via admin panel
- Manage the platform

## 🛠️ Troubleshooting

### If API Calls Fail:
1. Check backend is running on port 5000
2. Check axios is installed (`npm list axios`)
3. Check browser console for errors
4. Check network tab in DevTools

### If Pages Don't Load:
1. Check frontend is running on port 5173
2. Check router configuration
3. Check component imports

### If Database Issues:
1. Check MySQL is running
2. Check database exists: `laboratori_1_2026`
3. Check tables exist with setup scripts

## 🎉 Expected Result

After following these steps, you should have:
- ✅ Fully functional tutoring platform
- ✅ All pages loading correctly
- ✅ Authentication working
- ✅ Tutor management working
- ✅ Booking system working
- ✅ Contact system working
- ✅ Responsive design on all devices

The website should be exactly as it was before, with all features restored and working properly!
