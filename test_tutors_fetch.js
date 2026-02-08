const mysql = require('mysql2/promise');

async function testTutorsFetch() {
  try {
    // Connect to database using same config as backend
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // Test the exact query used in the tutors endpoint
    const [tutors] = await connection.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              tp.experience, tp.subject, tp.price_per_hour, tp.bio,
              COUNT(s.id) as total_sessions
       FROM users u
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       LEFT JOIN sessions s ON u.id = s.teacher_id
       WHERE u.role = 'teacher'
       GROUP BY u.id, u.name, u.email, u.created_at, tp.experience, tp.subject, tp.price_per_hour, tp.bio
       ORDER BY u.created_at DESC`
    );
    
    console.log('\n📚 Current tutors in database:');
    console.log('================================');
    
    if (tutors.length === 0) {
      console.log('❌ No tutors found in database');
      console.log('\n💡 You may need to:');
      console.log('1. Run: node run_setup.js (to create tables and sample tutors)');
      console.log('2. Add tutors through the admin panel at /admin/tutors');
    } else {
      tutors.forEach((tutor, index) => {
        console.log(`\n${index + 1}. ${tutor.name}`);
        console.log(`   Email: ${tutor.email}`);
        console.log(`   Subject: ${tutor.subject || 'Not specified'}`);
        console.log(`   Experience: ${tutor.experience || 0} years`);
        console.log(`   Price: $${tutor.price_per_hour || 0}/hour`);
        console.log(`   Bio: ${tutor.bio || 'No bio provided'}`);
        console.log(`   Sessions: ${tutor.total_sessions || 0}`);
      });
      
      console.log(`\n✅ Found ${tutors.length} tutor(s) in database`);
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error testing tutors fetch:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Check your MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found. Run: node run_setup.js');
    }
  }
}

testTutorsFetch();
