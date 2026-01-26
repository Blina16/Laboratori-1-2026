# User Registration Guide - TutorRemote Platform

## Overview
TutorRemote offers three distinct user roles, each with different registration processes and access levels:

1. **Student** - Regular users seeking tutoring services
2. **Teacher** - Tutors providing educational services  
3. **Admin** - Platform administrators with full system access

---

## 🎓 Student Registration

### **URL:** `/signup`

### **Process:**
1. **Role Selection:** Choose "Student" from dropdown
2. **Basic Information:** Name, email, password
3. **Password Requirements:** Minimum 8 characters
4. **Terms Agreement:** Accept terms and privacy policy
5. **Immediate Access:** Redirected to student dashboard after login

### **Features:**
- ✅ Open registration (no approval needed)
- ✅ Access to student dashboard
- ✅ Can book tutoring sessions
- ✅ Track learning progress
- ✅ Find and rate tutors

### **Redirect After Login:** `/student/dashboard`

---

## 👨‍🏫 Teacher Registration

### **URL:** `/signup`

### **Process:**
1. **Role Selection:** Choose "Teacher" from dropdown
2. **Basic Information:** Name, email, password
3. **Password Requirements:** Minimum 8 characters
4. **Terms Agreement:** Accept terms and privacy policy
5. **Immediate Access:** Redirected to teacher dashboard after login

### **Features:**
- ✅ Open registration (no approval needed)
- ✅ Access to teacher dashboard
- ✅ Can create tutoring sessions
- ✅ Manage student bookings
- ✅ Track earnings and ratings
- ✅ Set availability schedule

### **Redirect After Login:** `/teacher/dashboard`

---

## 🔐 Admin Registration

### **URL:** `/admin-signup`

### **Process:**
1. **Admin Authorization:** Requires secret admin key
2. **Enhanced Security:** Password confirmation required
3. **Authority Confirmation:** Must confirm admin authority
4. **Terms Agreement:** Accept terms and privacy policy
5. **Immediate Access:** Redirected to admin dashboard after creation

### **Security Features:**
- 🔒 **Admin Key Required:** Default: `admin123` (change in production)
- 🔒 **Separate Endpoint:** `/auth/register-admin`
- 🔒 **Enhanced Validation:** Authority confirmation required
- 🔒 **Secure Storage:** Admin role assigned in database

### **Features:**
- ✅ Full platform access
- ✅ User management (create, edit, delete users)
- ✅ System configuration
- ✅ Analytics and reporting
- ✅ Content moderation
- ✅ Financial oversight

### **Redirect After Login:** `/admin/dashboard`

---

## 📊 Comparison Table

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| **Registration URL** | `/signup` | `/signup` | `/admin-signup` |
| **Approval Required** | ❌ No | ❌ No | ✅ Yes (Admin Key) |
| **Dashboard** | `/student/dashboard` | `/teacher/dashboard` | `/admin/dashboard` |
| **Book Sessions** | ✅ Yes | ❌ No | ✅ Yes |
| **Create Sessions** | ❌ No | ✅ Yes | ✅ Yes |
| **Manage Users** | ❌ No | ❌ No | ✅ Yes |
| **View Analytics** | 👤 Personal | 👤 Personal | 🌐 System-wide |
| **Earnings Tracking** | ❌ No | ✅ Yes | ✅ Yes |

---

## 🔄 Login Flow

### **Role-Based Redirect Logic:**
```javascript
if (user.role === 'admin') {
  router.push('/admin/dashboard')
} else if (user.role === 'teacher') {
  router.push('/teacher/dashboard')  
} else if (user.role === 'student') {
  router.push('/student/dashboard')
} else {
  router.push('/dashboard') // fallback
}
```

---

## 🛡️ Security Considerations

### **Production Environment:**
1. **Change Admin Key:** Update `ADMIN_SECRET_KEY` in environment variables
2. **Email Verification:** Add email confirmation for all roles
3. **Rate Limiting:** Implement registration rate limits
4. **CAPTCHA:** Add bot protection
5. **Audit Logging:** Track admin account creation

### **Database Schema:**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 Getting Started

### **For Students:**
1. Go to `/signup`
2. Select "Student" role
3. Fill in your information
4. Start booking tutoring sessions!

### **For Teachers:**
1. Go to `/signup`
2. Select "Teacher" role
3. Fill in your information
4. Set up your tutoring profile and schedule!

### **For Admins:**
1. Go to `/admin-signup`
2. Enter admin authorization key
3. Complete registration
4. Access full admin dashboard!

---

## 📞 Support

For registration issues:
- **Students/Teachers:** Contact support via platform
- **Admins:** Contact system administrator
- **Technical Issues:** Check browser console and network logs

---

*Last Updated: January 2026*
*Platform Version: 1.0.0*
