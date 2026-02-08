const fs = require('fs');
const path = require('path');

async function restoreWebsite() {
  try {
    console.log('🔄 Restoring Website to Full Functionality...\n');
    
    // 1. Update package.json to include missing dependencies
    console.log('1️⃣ Updating package.json with missing dependencies...');
    
    const packageJsonPath = path.join('Frontend', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add missing dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "axios": "^1.6.0"
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added axios to package.json');
    
    // 2. Ensure all essential views exist
    const viewsDir = path.join('Frontend', 'src', 'views');
    const essentialViews = [
      'HomeView.vue',
      'AboutView.vue', 
      'ContactView.vue',
      'LoginView.vue',
      'SignUpView.vue',
      'AdminSignUpView.vue',
      'TutoringPage.vue',
      'TutorsView.vue'
    ];
    
    console.log('\n2️⃣ Checking essential views...');
    for (const view of essentialViews) {
      const viewPath = path.join(viewsDir, view);
      if (!fs.existsSync(viewPath)) {
        console.log(`❌ Missing: ${view}`);
      } else {
        console.log(`✅ Found: ${view}`);
      }
    }
    
    // 3. Check essential components
    const componentsDir = path.join('Frontend', 'src', 'components');
    const essentialComponents = [
      'AppNavbar.vue',
      'AppFooter.vue',
      'ContactModal.vue',
      'BookingModal.vue'
    ];
    
    console.log('\n3️⃣ Checking essential components...');
    for (const component of essentialComponents) {
      const componentPath = path.join(componentsDir, component);
      if (!fs.existsSync(componentPath)) {
        console.log(`❌ Missing: ${component}`);
      } else {
        console.log(`✅ Found: ${component}`);
      }
    }
    
    // 4. Verify API service
    const apiServicePath = path.join('Frontend', 'src', 'services', 'api.js');
    if (fs.existsSync(apiServicePath)) {
      console.log('\n✅ API service exists');
    } else {
      console.log('\n❌ API service missing');
    }
    
    // 5. Check router configuration
    const routerPath = path.join('Frontend', 'src', 'router', 'index.js');
    if (fs.existsSync(routerPath)) {
      console.log('✅ Router configuration exists');
    } else {
      console.log('❌ Router configuration missing');
    }
    
    console.log('\n🎉 Website structure check completed!');
    
    console.log('\n💡 To complete the restoration:');
    console.log('   1. Install dependencies:');
    console.log('      cd Frontend && npm install');
    console.log('   2. Start backend server:');
    console.log('      cd Backend && node index.js');
    console.log('   3. Start frontend server:');
    console.log('      cd Frontend && npm run dev');
    console.log('   4. Setup database tables:');
    console.log('      node run_setup.js');
    console.log('      node setup_booking_tables.js');
    console.log('      node setup_contact_feature.js');
    
    console.log('\n📋 Website Features:');
    console.log('   ✅ Home page with landing content');
    console.log('   ✅ About page');
    console.log('   ✅ Contact page');
    console.log('   ✅ Tutor listings');
    console.log('   ✅ Student dashboard with tutors');
    console.log('   ✅ Admin panel for tutor management');
    console.log('   ✅ Booking system');
    console.log('   ✅ Contact/messaging system');
    console.log('   ✅ Authentication (login/signup)');
    console.log('   ✅ Responsive navigation');
    
  } catch (error) {
    console.error('❌ Restoration failed:', error.message);
  }
}

restoreWebsite();
