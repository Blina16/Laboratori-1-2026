// Test to verify right sidebar layout in Student Dashboard
const fs = require('fs');
const path = require('path');

console.log('Testing Right Sidebar Layout...\n');

const dashboardPath = path.join(__dirname, 'Frontend/src/views/StudentDashboardView.vue');
if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  const checks = [
    { name: 'Main container uses flex layout', pattern: /class="min-h-screen bg-gray-50 flex"/ },
    { name: 'Main content takes flex-1', pattern: /<div class="flex-1 relative">/ },
    { name: 'Right sidebar exists', pattern: /<!-- Right Sidebar -->/ },
    { name: 'Right sidebar has fixed width', pattern: /class="w-64 bg-white shadow-lg"/ },
    { name: 'Tutors button in sidebar', pattern: /Tutors.*showTutors/ },
    { name: 'Courses button in sidebar', pattern: /Courses.*showCourses/ },
    { name: 'Calendar button in sidebar', pattern: /Calendar.*showCalendar/ },
    { name: 'No left sidebar', pattern: !content.includes('<!-- Left Sidebar -->') }
  ];
  
  let passed = 0;
  let total = checks.length;
  
  checks.forEach(check => {
    if (check.pattern === !content.includes('<!-- Left Sidebar -->')) {
      // Special case for checking absence of left sidebar
      if (!content.includes('<!-- Left Sidebar -->')) {
        console.log(`✅ ${check.name} - Confirmed`);
        passed++;
      } else {
        console.log(`❌ ${check.name} - Failed`);
      }
    } else if (check.pattern.test(content)) {
      console.log(`✅ ${check.name} - Found`);
      passed++;
    } else {
      console.log(`❌ ${check.name} - Missing`);
    }
  });
  
  console.log(`\nTest Results: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('🎉 Right sidebar layout is correctly implemented!');
    console.log('📱 The menu (Tutors, Courses, Calendar) is now on the right side.');
  } else {
    console.log('⚠️  Some layout issues detected.');
  }
  
} else {
  console.log('❌ StudentDashboardView.vue file not found');
}
