

  const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' }
        });
  
        const responseData = await response.json(); // Parse the JSON response
  
        if (response.ok) {
          document.location.replace('/api/tasks');
        } else {
          // Display error message from response
          alert(responseData.message);
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while trying to log in.'); // Handle other errors
      }
    } else {
      alert('Please enter both email and password.');
    }
  };
  
  document.querySelector('form').addEventListener('submit', loginFormHandler);
