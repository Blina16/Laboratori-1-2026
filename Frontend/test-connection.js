// Test connection to backend
const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    const response = await fetch('http://localhost:5000/api/availability/test');
    const data = await response.json();
    
    console.log('✅ Connection successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return { error: error.message };
  }
};

// Test the connection
testConnection().then(result => {
  console.log('Test result:', result);
}).catch(error => {
  console.error('Test failed:', error);
});
