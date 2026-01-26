const db = require('./Backend/config/db');

async function main() {
  try {
    const [cols] = await db.query('SHOW COLUMNS FROM courses');
    console.log('COURSES COLUMNS:');
    console.table(cols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key, Default: c.Default })));

    const [sample] = await db.query('SELECT * FROM courses LIMIT 5');
    console.log('SAMPLE ROWS (up to 5):');
    console.dir(sample, { depth: 5 });
  } catch (e) {
    console.error('FAILED:', e.message);
  } finally {
    process.exit(0);
  }
}

main();
