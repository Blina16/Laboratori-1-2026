const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test the availability creation endpoint
app.post('/test-availability', async (req, res) => {
  try {
    console.log('Test request received:', req.body);
    
    const testData = {
      teacher_id: 1,
      date: '2024-01-26',
      start_time: '10:00',
      end_time: '11:00',
      max_students: 2,
      recurring_pattern: null,
      recurring_end_date: null,
      notes: 'Test availability'
    };
    
    // Make actual API call to your server
    const response = await fetch('http://localhost:5000/api/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('API Response:', result);
    
    res.json({
      success: true,
      apiResponse: result,
      status: response.status
    });
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3001, () => {
  console.log('Test server running on http://localhost:3001');
  console.log('Send POST request to /test-availability to test availability creation');
});
