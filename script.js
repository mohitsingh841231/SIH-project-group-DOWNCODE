document.addEventListener('DOMContentLoaded', function () {
    const signUpButton = document.getElementById('sign-btn');
  
    if (signUpButton) {
      signUpButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default behavior of opening in a new tab
        window.location.href = 'signUp.html'; // Redirect to the sign-up page in the same tab
      });
    }
  });
  