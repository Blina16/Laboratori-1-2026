// Test to verify original left sidebar layout is restored
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Original Layout Restoration...\n');

const dashboardPath = path.join(__dirname, 'Frontend/src/views/StudentDashboardView.vue');
if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  const checks = [
    { name: 'Left sidebar exists', pattern: /<!-- Left Sidebar -->/ },
    { name: 'Right sidebar removed', pattern: !content.includes('<!-- Right Sidebar -->') },
    { name: 'Menu in left sidebar', pattern: /Tutors.*showTutors/ },
    { name: 'Courses button', pattern: /Courses.*showCourses/ },
    { name: 'Calendar button', pattern: /Calendar.*showCalendar/ },
    { name: 'Main content area', pattern: /<!-- Main Content -->/ },
    { name: 'Favorites dropdown', pattern: /showFavorites/ },
    { name: 'Proper flex layout', pattern: /class="min-h-screen bg-gray-50 flex"/ }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.pattern === !content.includes('<!-- Right Sidebar -->')) {
      // Special case for checking absence of right sidebar
      if (!content.includes('<!-- Right Sidebar -->')) {
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
  
  console.log(`\n✅ Layout Restoration: ${passed}/${checks.length} checks passed`);
  
  if (passed === checks.length) {
    console.log('🎉 Original left sidebar layout successfully restored!');
    console.log('📱 Layout structure:');
    console.log('   ┌─────────┬─────────────────────────┐');
    console.log('   │  Menu  │     Main Content     │');
    console.log('   │ (Left)  │                     │');
    console.log('   │         │  • Dashboard        │');
    console.log('   │ • Tutors│  • Stats           │');
    console.log('   │ • Courses│  • Quick Actions   │');
    console.log('   │ • Calendar│  • Tutors/Courses  │');
    console.log('   │         │  • Calendar         │');
    console.log('   └─────────┴─────────────────────────┘');
  } else {
    console.log('⚠️  Some layout issues remain.');
  }
  
} else {
  console.log('❌ StudentDashboardView.vue file not found');
}
