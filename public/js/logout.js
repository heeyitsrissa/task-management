const logout = async () => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      // Redirect to the desired page
      window.location.replace('/');
    } else {
      // Handle error
      alert(response.statusText);
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


document.querySelector('#logout').addEventListener('click', logout);
