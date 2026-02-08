const mysql = require('mysql2/promise');
const fs = require('fs');

async function setupContactFeature() {
  try {
    console.log('🚀 Setting up Contact Feature...\n');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // Read and execute the messages table SQL
    const sqlContent = fs.readFileSync('create_messages_table.sql', 'utf8');
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim() && !statement.trim().startsWith('--')) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    // Verify table was created
    const [tables] = await connection.execute('SHOW TABLES LIKE \"messages\"');
    if (tables.length > 0) {
      console.log('✅ messages table created successfully');
    } else {
      console.log('❌ messages table was not created');
    }
    
    await connection.end();
    console.log('\n🎉 Contact feature setup completed!');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Start backend: cd Backend && node index.js');
    console.log('   2. Start frontend: cd Frontend && npm run dev');
    console.log('   3. Login as student and test the contact feature');
    console.log('   4. Click "Contact" or "Send Message" buttons on tutor cards');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database access denied. Check MySQL credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database not found. Make sure laboratori_1_2026 exists.');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n💡 Users table not found. Run: node run_setup.js');
    }
  }
}

setupContactFeature();
