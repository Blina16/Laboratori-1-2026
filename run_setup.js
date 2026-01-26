const mysql = require('mysql2/promise');
const fs = require('fs');

async function runSetup() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'laboratori_1_2026'
    });
    
    console.log('✅ Connected to database');
    
    // Read and execute SQL file
    const sqlContent = fs.readFileSync('create_availability_tables.sql', 'utf8');
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    
    await connection.end();
    
    // Run sample tutors if exists
    if (fs.existsSync('insert_sample_tutors.sql')) {
      console.log('📝 Adding sample tutors...');
      const tutorsSql = fs.readFileSync('insert_sample_tutors.sql', 'utf8');
      const tutorStatements = tutorsSql.split(';').filter(stmt => stmt.trim());
      
      const connection2 = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'laboratori_1_2026'
      });
      
      for (const statement of tutorStatements) {
        if (statement.trim()) {
          await connection2.execute(statement);
          console.log('✅ Added tutor:', statement.substring(0, 50) + '...');
        }
      }
      
      await connection2.end();
      console.log('✅ Sample tutors added successfully!');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

runSetup();
