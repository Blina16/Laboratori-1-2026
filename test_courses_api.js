const axios = require('axios');

const base = 'http://localhost:5000/api';

async function main() {
  console.log('🧪 Testing Courses API...');

  // pick a teacher from /users/teachers
  const teachersRes = await axios.get(`${base}/users/teachers`);
  const teachers = teachersRes.data;
  if (!teachers.length) {
    throw new Error('No teachers found. Create a tutor/teacher first.');
  }
  const teacherId = teachers[0].id;
  console.log('Using teacher_id:', teacherId);

  // GET all courses
  const list1 = await axios.get(`${base}/courses`);
  console.log('✅ GET /courses count:', list1.data.length);

  // POST create course
  const created = await axios.post(`${base}/courses`, {
    name: 'API Course Test',
    description: 'Created from test script',
    duration: '10 weeks',
    level: 'Beginner',
    price: 100,
    assigned_tutor_id: teacherId,
  });
  console.log('✅ POST /courses created id:', created.data.id);

  // GET single course
  const single = await axios.get(`${base}/courses/${created.data.id}`);
  console.log('✅ GET /courses/:id name:', single.data.name);

  // PUT update course
  const updated = await axios.put(`${base}/courses/${created.data.id}`, {
    name: 'API Course Test (Updated)',
    description: 'Updated from test script',
    duration: '12 weeks',
    level: 'Intermediate',
    price: 150,
    assigned_tutor_id: teacherId,
  });
  console.log('✅ PUT /courses/:id name:', updated.data.name);

  // DELETE course
  const del = await axios.delete(`${base}/courses/${created.data.id}`);
  console.log('✅ DELETE /courses/:id:', del.data);

  // Final GET
  const list2 = await axios.get(`${base}/courses`);
  console.log('✅ GET /courses final count:', list2.data.length);

  console.log('🎉 Courses API OK');
}

main().catch((err) => {
  console.error('❌ Courses API test failed');
  if (err.response) {
    console.error('Status:', err.response.status);
    console.error('Data:', err.response.data);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});
