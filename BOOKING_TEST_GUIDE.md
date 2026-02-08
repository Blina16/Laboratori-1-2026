# Booking System Testing Guide

## 🚀 Quick Start

### 1. Setup Database Tables
```bash
# Create the booking tables
node -e "
const mysql = require('mysql2/promise');
async function setup() {
  const fs = require('fs');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'laboratori_1_2026'
  });
  
  const sql = fs.readFileSync('create_booking_tables.sql', 'utf8');
  const statements = sql.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await connection.execute(statement);
      console.log('✅ Executed:', statement.substring(0, 50) + '...');
    }
  }
  
  await connection.end();
  console.log('🎉 Booking tables created successfully!');
}
setup();
"
```

### 2. Start Backend Server
```bash
cd Backend
node index.js
```

### 3. Start Frontend
```bash
cd Frontend
npm run dev
```

## 📋 Testing Steps

### Step 1: Create Sample Data
1. Go to `http://localhost:5173/admin-signup` - Create admin account
2. Login as admin at `http://localhost:5173/login`
3. Go to `http://localhost:5173/admin/tutors`
4. Click "Add Tutor" and create a few tutors:
   - Name: John Smith
   - Email: john@tutor.com
   - Subject: Mathematics
   - Experience: 5 years
   - Price: $50/hour
   - Bio: Experienced math tutor

### Step 2: Create Student Account
1. Go to `http://localhost:5173/signup` - Create student account
2. Login as student

### Step 3: Test Booking Flow
1. Go to Student Dashboard: `http://localhost:5173/student/dashboard`
2. You should see all available tutors
3. Click on any tutor card
4. Click "View Profile" in the modal
5. Click "Book Session" button
6. Fill in the booking form:
   - Subject: (pre-filled with tutor's specialty)
   - Date: Pick tomorrow's date
   - Time: Pick any time (e.g., 3:00 PM)
   - Duration: 60 minutes
   - Notes: "Test booking session"
7. Click "Confirm Booking"

### Expected Results
- ✅ Success message: "Session booked successfully! 🎉"
- ✅ Booking appears in database
- ✅ Modal closes automatically

## 🔍 Debugging Tips

### If Booking Fails:
1. **Check Backend Console** - Look for error messages
2. **Check Database Tables**:
   ```sql
   SELECT * FROM student_tutor_sessions ORDER BY created_at DESC LIMIT 5;
   ```
3. **Check API Response** - Open browser DevTools, Network tab

### Common Issues:
- **"User not logged in"** - Make sure you're logged in as a student
- **"Tutor not found"** - Make sure tutors exist in the database
- **Database connection errors** - Check MySQL is running

## 🧪 API Testing

You can test the booking API directly:

```bash
# Test creating a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "tutor_id": 1,
    "subject": "Mathematics",
    "scheduled_date": "2024-01-25T15:00:00Z",
    "duration_minutes": 60,
    "notes": "Test booking",
    "price": 50.00
  }'
```

## 📊 Check Bookings

### View All Bookings:
```sql
SELECT 
    sts.id,
    sts.subject,
    sts.session_date,
    sts.duration_minutes,
    sts.price,
    sts.status,
    s.name as student_name,
    t.name as tutor_name
FROM student_tutor_sessions sts
JOIN users s ON sts.student_id = s.id
JOIN users t ON sts.tutor_id = t.id
ORDER BY sts.session_date DESC;
```

### View Student's Bookings:
```sql
SELECT * FROM student_tutor_sessions WHERE student_id = 1;
```

### View Tutor's Bookings:
```sql
SELECT * FROM student_tutor_sessions WHERE tutor_id = 1;
```

## 🎯 Features Working

✅ **Student Dashboard** - Shows all available tutors  
✅ **Tutor Profiles** - Detailed tutor information  
✅ **Booking Modal** - Form to book sessions  
✅ **Price Calculation** - Automatic cost calculation  
✅ **Database Storage** - Bookings saved to database  
✅ **API Integration** - Proper API calls  
✅ **Error Handling** - User-friendly error messages  

## 🔄 Next Steps

1. **Add Calendar View** - Show bookings in a calendar
2. **Email Notifications** - Send booking confirmations
3. **Payment Integration** - Add payment processing
4. **Tutor Availability** - Check tutor availability before booking
5. **Review System** - Allow students to rate tutors after sessions

## 📞 Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the backend terminal for server errors
3. Verify database tables exist and have data
4. Ensure both frontend and backend are running

Happy booking! 🎉
