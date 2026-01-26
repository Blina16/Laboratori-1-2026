const axios = require('axios')

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

async function testStudentAPI() {
  console.log('🧪 Testing Student API endpoints...\n')

  try {
    // Test 1: Get all students
    console.log('1. Testing GET /api/students')
    const getResponse = await api.get('/students')
    console.log('✅ GET /students:', getResponse.status, getResponse.data.length, 'students')
    console.log('   Sample student:', getResponse.data[0] || 'No students found')
    console.log()

    // Test 2: Create a new student
    console.log('2. Testing POST /api/students')
    const newStudent = {
      name: 'Test Student',
      email: `teststudent${Date.now()}@example.com`,
      password: 'password123'
    }
    const createResponse = await api.post('/students', newStudent)
    console.log('✅ POST /students:', createResponse.status)
    console.log('   Created student:', createResponse.data)
    const studentId = createResponse.data.id
    console.log()

    // Test 3: Get student by ID
    console.log('3. Testing GET /api/students/:id')
    const getByIdResponse = await api.get(`/students/${studentId}`)
    console.log('✅ GET /students/:id:', getByIdResponse.status)
    console.log('   Student details:', getByIdResponse.data)
    console.log()

    // Test 4: Update student
    console.log('4. Testing PUT /api/students/:id')
    const updateData = {
      name: 'Updated Student Name',
      email: `updated${Date.now()}@example.com`
    }
    const updateResponse = await api.put(`/students/${studentId}`, updateData)
    console.log('✅ PUT /students/:id:', updateResponse.status)
    console.log('   Updated student:', updateResponse.data)
    console.log()

    // Test 5: Delete student
    console.log('5. Testing DELETE /api/students/:id')
    const deleteResponse = await api.delete(`/students/${studentId}`)
    console.log('✅ DELETE /students/:id:', deleteResponse.status)
    console.log('   Delete response:', deleteResponse.data)
    console.log()

    // Test 6: Verify deletion
    console.log('6. Verifying deletion')
    try {
      await api.get(`/students/${studentId}`)
      console.log('❌ Student still exists after deletion')
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Student successfully deleted')
      } else {
        console.log('❌ Unexpected error:', error.message)
      }
    }

    console.log('\n🎉 All Student API tests completed successfully!')

  } catch (error) {
    console.error('❌ API Test failed:', error.response?.status, error.response?.data || error.message)
  }
}

testStudentAPI()
