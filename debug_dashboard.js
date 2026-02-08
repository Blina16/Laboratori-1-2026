// Debug script to identify why Student Dashboard shows nothing
console.log('🔍 Debugging Student Dashboard Issue...\n');

const fs = require('fs');
const path = require('path');

// Check if user is logged in (simulate browser localStorage)
console.log('📋 Checking authentication requirements:');
console.log('   - Student dashboard requires authentication');
console.log('   - Need token in localStorage');
console.log('   - Need user data in localStorage');

// Check the dashboard component for potential issues
const dashboardPath = path.join(__dirname, 'Frontend/src/views/StudentDashboardView.vue');
if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  console.log('\n🔍 Analyzing StudentDashboardView.vue:');
  
  // Check for v-if conditions that might hide content
  const vIfMatches = content.match(/v-if="[^"]*"/g);
  if (vIfMatches) {
    console.log('   Found v-if conditions:');
    vIfMatches.forEach(match => {
      console.log(`     - ${match}`);
    });
  }
  
  // Check for data loading
  console.log('\n📊 Data loading functions:');
  const functions = [
    'loadUser',
    'loadStats', 
    'loadUpcomingSessions',
    'fetchTutors',
    'fetchCourses',
    'fetchCalendar'
  ];
  
  functions.forEach(func => {
    const regex = new RegExp(`const ${func} = async`, 'i');
    if (regex.test(content)) {
      console.log(`   ✅ ${func} function found`);
    } else {
      console.log(`   ❌ ${func} function missing`);
    }
  });
  
  // Check initial visibility states
  console.log('\n👁️  Initial visibility states:');
  const visibilityChecks = [
    { name: 'showTutors', pattern: /const showTutors = ref\(true\)/ },
    { name: 'showCourses', pattern: /const showCourses = ref\(false\)/ },
    { name: 'showCalendar', pattern: /const showCalendar = ref\(false\)/ }
  ];
  
  visibilityChecks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`   ✅ ${check.name} initialized correctly`);
    } else {
      console.log(`   ❌ ${check.name} initialization issue`);
    }
  });
  
  // Check for template structure issues
  console.log('\n🏗️  Template structure:');
  const templateStart = content.indexOf('<template>');
  const templateEnd = content.indexOf('</template>');
  const scriptStart = content.indexOf('<script setup>');
  
  if (templateStart !== -1 && templateEnd !== -1) {
    console.log('   ✅ Template tags properly placed');
  } else {
    console.log('   ❌ Template tag issues');
  }
  
  if (scriptStart !== -1) {
    console.log('   ✅ Script setup found');
  } else {
    console.log('   ❌ Script setup missing');
  }
  
}

console.log('\n🔧 Troubleshooting steps:');
console.log('1. Check browser console for JavaScript errors');
console.log('2. Verify you are logged in (token and user in localStorage)');
console.log('3. Check Network tab for failed API requests');
console.log('4. Ensure backend server is running on localhost:5000');
console.log('5. Try accessing /student/dashboard directly in URL');
console.log('6. Check if other pages load correctly');

console.log('\n💡 Quick test:');
console.log('   Open browser console and run:');
console.log('   localStorage.getItem("token")');
console.log('   localStorage.getItem("user")');
console.log('   Both should return values (not null)');
