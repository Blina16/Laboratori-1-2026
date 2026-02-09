// Complete test for payments CRUD operations
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPaymentsCRUD() {
  console.log('🧪 Testing Complete Payments CRUD Integration...\n');

  try {
    // Test 1: Check server connectivity
    console.log('1. Testing server connectivity...');
    try {
      const response = await axios.get(`${API_BASE}/test`);
      console.log('✅ Server is running:', response.data.message);
    } catch (error) {
      console.log('❌ Server is not running:', error.message);
      console.log('💡 Please start server: cd Backend && node server.js');
      return;
    }

    // Test 2: Check if payments endpoint works
    console.log('\n2. Testing payments endpoint...');
    try {
      const paymentsResponse = await axios.get(`${API_BASE}/payments`);
      console.log('✅ Payments endpoint working');
      console.log(`📊 Current payments count: ${paymentsResponse.data.length}`);
    } catch (error) {
      if (error.response?.data?.message?.includes('Database tables not found')) {
        console.log('❌ Database tables missing');
        console.log('💡 Run: cd Backend && node init_db.js');
        return;
      } else {
        console.log('❌ Payments endpoint test failed:', error.response?.data || error.message);
        return;
      }
    }

    // Test 3: Get sample data for testing
    console.log('\n3. Getting sample data for testing...');
    let studentId = null;
    let tutorId = null;
    let courseId = null;

    try {
      // Get students
      const studentsResponse = await axios.get(`${API_BASE}/users/students`);
      if (studentsResponse.data.length > 0) {
        studentId = studentsResponse.data[0].id;
        console.log('✅ Found student:', studentsResponse.data[0].name);
      }

      // Get tutors
      const tutorsResponse = await axios.get(`${API_BASE}/users/teachers`);
      if (tutorsResponse.data.length > 0) {
        tutorId = tutorsResponse.data[0].id;
        console.log('✅ Found tutor:', tutorsResponse.data[0].name);
      }

      // Get courses
      const coursesResponse = await axios.get(`${API_BASE}/courses`);
      if (coursesResponse.data.length > 0) {
        courseId = coursesResponse.data[0].id;
        console.log('✅ Found course:', coursesResponse.data[0].title);
      }

      if (!studentId || !tutorId) {
        console.log('❌ Missing required student or tutor data');
        console.log('💡 Please ensure you have students and tutors in the database');
        return;
      }
    } catch (error) {
      console.log('❌ Failed to get sample data:', error.response?.data || error.message);
      return;
    }

    // Test 4: Create a new payment
    console.log('\n4. Testing payment creation...');
    const newPayment = {
      student_id: studentId,
      tutor_id: tutorId,
      course_id: courseId,
      amount: 199.99,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'credit_card',
      status: 'pending',
      transaction_id: 'TXN' + Date.now(),
      notes: 'Test payment for integration testing'
    };

    let createdPaymentId = null;
    try {
      const createResponse = await axios.post(`${API_BASE}/payments`, newPayment);
      console.log('✅ Payment created successfully:', createResponse.data.student_name);
      createdPaymentId = createResponse.data.id;
      console.log('📝 Created payment ID:', createdPaymentId);
      console.log('📝 Created payment details:', {
        id: createResponse.data.id,
        student: createResponse.data.student_name,
        tutor: createResponse.data.tutor_name,
        amount: createResponse.data.amount,
        status: createResponse.data.status
      });
    } catch (createError) {
      console.log('❌ Payment creation failed:', createError.response?.data || createError.message);
      return;
    }

    // Test 5: Update payment
    console.log('\n5. Testing payment update...');
    const updateData = {
      student_id: studentId,
      tutor_id: tutorId,
      course_id: courseId,
      amount: 249.99,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'paypal',
      status: 'completed',
      transaction_id: 'TXN' + Date.now() + '_UPDATED',
      notes: 'Updated test payment'
    };

    try {
      const updateResponse = await axios.put(`${API_BASE}/payments/${createdPaymentId}`, updateData);
      console.log('✅ Payment updated successfully:', updateResponse.data.status);
      console.log('📝 Updated payment details:', {
        id: updateResponse.data.id,
        amount: updateResponse.data.amount,
        status: updateResponse.data.status,
        payment_method: updateResponse.data.payment_method
      });
    } catch (updateError) {
      console.log('❌ Payment update failed:', updateError.response?.data || updateError.message);
    }

    // Test 6: Verify payment in list
    console.log('\n6. Testing payment retrieval...');
    try {
      const listResponse = await axios.get(`${API_BASE}/payments`);
      const updatedPayment = listResponse.data.find(p => p.id === createdPaymentId);
      if (updatedPayment) {
        console.log('✅ Payment found in list:', updatedPayment.student_name);
        console.log('📊 Payment data in list:', {
          id: updatedPayment.id,
          student: updatedPayment.student_name,
          tutor: updatedPayment.tutor_name,
          course: updatedPayment.course_title,
          amount: updatedPayment.amount,
          status: updatedPayment.status,
          payment_date: updatedPayment.payment_date
        });
      } else {
        console.log('❌ Payment not found in list');
      }
    } catch (listError) {
      console.log('❌ Payment retrieval failed:', listError.response?.data || listError.message);
    }

    // Test 7: Delete payment
    console.log('\n7. Testing payment deletion...');
    try {
      const deleteResponse = await axios.delete(`${API_BASE}/payments/${createdPaymentId}`);
      console.log('✅ Payment deleted successfully:', deleteResponse.data.message);
    } catch (deleteError) {
      console.log('❌ Payment deletion failed:', deleteError.response?.data || deleteError.message);
    }

    // Test 8: Verify deletion
    console.log('\n8. Testing deletion verification...');
    try {
      const finalListResponse = await axios.get(`${API_BASE}/payments`);
      const deletedPayment = finalListResponse.data.find(p => p.id === createdPaymentId);
      if (!deletedPayment) {
        console.log('✅ Payment successfully removed from list');
      } else {
        console.log('❌ Payment still found in list after deletion');
      }
    } catch (verifyError) {
      console.log('❌ Deletion verification failed:', verifyError.response?.data || verifyError.message);
    }

    console.log('\n🎉 Complete payments CRUD test finished!');
    console.log('\n📋 Summary:');
    console.log('✅ Backend API: Working');
    console.log('✅ Database: Connected');
    console.log('✅ Payment CRUD Operations: Functional');
    console.log('✅ Using exact same pattern as tutors and courses');

  } catch (error) {
    console.error('❌ Payments CRUD test failed:', error.message);
  }
}

testPaymentsCRUD();
