// Test to check if Student Dashboard component loads properly
console.log('Testing Student Dashboard Component Loading...\n');

// Check if the file exists and has basic structure
const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'Frontend/src/views/StudentDashboardView.vue');

if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  console.log('✅ StudentDashboardView.vue file exists');
  
  // Check for essential Vue structure
  const essentialChecks = [
    { name: 'Template tag', pattern: /<template>/ },
    { name: 'Script setup tag', pattern: /<script setup>/ },
    { name: 'Vue imports', pattern: /import { ref, onMounted, computed } from 'vue'/ },
    { name: 'API import', pattern: /import api from '@\/services\/api'/ },
    { name: 'Component name', pattern: /defineOptions/ },
    { name: 'User data ref', pattern: /const user = ref/ },
    { name: 'Show tutors ref', pattern: /const showTutors = ref\(true\)/ },
    { name: 'onMounted hook', pattern: /onMounted\(\(\)/ },
    { name: 'Load user function', pattern: /const loadUser = / },
    { name: 'Fetch tutors function', pattern: /const fetchTutors = / }
  ];
  
  let passed = 0;
  essentialChecks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name} - Found`);
      passed++;
    } else {
      console.log(`❌ ${check.name} - Missing`);
    }
  });
  
  console.log(`\nEssential checks: ${passed}/${essentialChecks.length} passed`);
  
  // Check for potential issues
  console.log('\n🔍 Checking for potential issues...');
  
  const issueChecks = [
    { name: 'Syntax errors in template', pattern: /<[^>]*$/m, shouldMatch: false },
    { name: 'Unclosed div tags', pattern: /<div[^>]*>(?!.*<\/div>)/gs, shouldMatch: false },
    { name: 'Missing closing tags', pattern: /<(?!\/)(?!!--)[a-zA-Z][^>]*>(?!.*<\/\1>)/gs, shouldMatch: false }
  ];
  
  let issuesFound = 0;
  issueChecks.forEach(check => {
    const matches = content.match(check.pattern);
    if (check.shouldMatch) {
      if (matches) {
        console.log(`⚠️  ${check.name} - Found ${matches.length} potential issues`);
        issuesFound++;
      }
    } else {
      if (matches && matches.length > 0) {
        console.log(`⚠️  ${check.name} - Found ${matches.length} potential issues`);
        issuesFound++;
      } else {
        console.log(`✅ ${check.name} - No issues found`);
      }
    }
  });
  
  if (issuesFound === 0) {
    console.log('\n🎉 Component structure looks good!');
    console.log('💡 If you still see nothing, check:');
    console.log('   1. Backend server is running on localhost:5000');
    console.log('   2. Frontend development server is running');
    console.log('   3. Browser console for JavaScript errors');
    console.log('   4. Network tab for failed API requests');
  } else {
    console.log('\n⚠️  Some structural issues found. Please review.');
  }
  
} else {
  console.log('❌ StudentDashboardView.vue file not found');
}
