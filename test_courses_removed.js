// Test to verify courses have been completely removed from student dashboard
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Courses Removal...\n');

const dashboardPath = path.join(__dirname, 'Frontend/src/views/StudentDashboardView.vue');
if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  const checks = [
    { name: 'Courses button removed from sidebar', pattern: !content.includes('showCourses = true') },
    { name: 'Courses variable removed', pattern: !content.includes('const showCourses = ref') },
    { name: 'Courses data ref removed', pattern: !content.includes('const courses = ref([])') },
    { name: 'fetchCourses function removed', pattern: !content.includes('const fetchCourses = async') },
    { name: 'isLoadingCourses removed', pattern: !content.includes('const isLoadingCourses = ref') },
    { name: 'fetchCourses call removed', pattern: !content.includes('fetchCourses()') },
    { name: 'Courses section removed', pattern: !content.includes('<!-- Courses Section -->') },
    { name: 'No Courses State removed', pattern: !content.includes('No courses available') },
    { name: 'Tutors button still exists', pattern: content.includes('showTutors = true') },
    { name: 'Calendar button still exists', pattern: content.includes('showCalendar = true') }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.pattern) {
      console.log(`✅ ${check.name} - Confirmed`);
      passed++;
    } else {
      console.log(`❌ ${check.name} - Failed`);
    }
  });
  
  console.log(`\n✅ Courses Removal: ${passed}/${checks.length} checks passed`);
  
  if (passed === checks.length) {
    console.log('🎉 All courses-related content successfully removed!');
    console.log('📱 Updated Layout:');
    console.log('   ┌─────────┬─────────────────────────┐');
    console.log('   │  Menu  │     Main Content     │');
    console.log('   │ (Left)  │                     │');
    console.log('   │ • Tutors│  • Dashboard        │');
    console.log('   │ • Calendar│  • Stats           │');
    console.log('   │         │  • Quick Actions   │');
    console.log('   │         │  • Tutors Section  │');
    console.log('   │         │  • Calendar         │');
    console.log('   │         │  • Booking Modals   │');
    console.log('   └─────────┴─────────────────────────┘');
    console.log('\n💡 Student dashboard now focuses on:');
    console.log('   • Finding and booking tutors');
    console.log('   • Managing calendar and sessions');
    console.log('   • Favorite tutors functionality');
    console.log('   • Dashboard statistics');
  } else {
    console.log('⚠️  Some course-related content may still exist.');
  }
  
} else {
  console.log('❌ StudentDashboardView.vue file not found');
}
