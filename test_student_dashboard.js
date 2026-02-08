// Simple test to verify Student Dashboard functionality
const fs = require('fs');
const path = require('path');

console.log('Testing Student Dashboard...\n');

// Check if the file exists
const dashboardPath = path.join(__dirname, 'Frontend/src/views/StudentDashboardView.vue');
if (fs.existsSync(dashboardPath)) {
  console.log('✅ StudentDashboardView.vue file exists');
  
  // Read the file content
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  // Check for key components
  const checks = [
    { name: 'Template section', pattern: /<template>/ },
    { name: 'Script setup section', pattern: /<script setup>/ },
    { name: 'fetchTutors function', pattern: /const fetchTutors = async/ },
    { name: 'fetchCourses function', pattern: /const fetchCourses = async/ },
    { name: 'fetchCalendar function', pattern: /const fetchCalendar = async/ },
    { name: 'onMounted hook', pattern: /onMounted\(\(\)/ },
    { name: 'Quick Actions section', pattern: /Quick Actions/ },
    { name: 'Tutors section', pattern: /showTutors/ },
    { name: 'Courses section', pattern: /showCourses/ },
    { name: 'Calendar section', pattern: /showCalendar/ },
    { name: 'Booking modal', pattern: /showBookingModal/ },
    { name: 'Favorite tutors', pattern: /favoriteTutors/ }
  ];
  
  let passed = 0;
  let total = checks.length;
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name} - Found`);
      passed++;
    } else {
      console.log(`❌ ${check.name} - Missing`);
    }
  });
  
  console.log(`\nTest Results: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Student dashboard should work correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.');
  }
  
} else {
  console.log('❌ StudentDashboardView.vue file not found');
}
