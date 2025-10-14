// Animation
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Eye Toggle Icon
function setupPasswordToggle(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);

    toggleIcon.addEventListener('click', () => {
        const isHidden = passwordInput.type === 'password';
        passwordInput.type = isHidden ? 'text' : 'password';
        toggleIcon.classList.toggle('bx-show', !isHidden);
        toggleIcon.classList.toggle('bx-hide', isHidden);
    });
}

setupPasswordToggle('login-password', 'toggle-login-password');
setupPasswordToggle('register-password', 'toggle-register-password');

// Local Storage for Authentication
function getStoredUsers() {
    const users = localStorage.getItem('users'); // get data from browser
    return users ? JSON.parse(users) : []; // convert to array if exists
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users)); // convert to string and store
}

function handleRegister(event) {
    event.preventDefault(); // prevent form submission
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Validaion checks
    if (!isValidUsername(username)) {
        alert('❌ Invalid Username!\nUse only letters, numbers, underscores and at least 3 characters.');
        return;
    }

    if (!isValidEmail(email)) {
    alert('❌ Invalid Email!\nEnter a valid email like example@gmail.com');
    return;
  }

  if (!isValidPassword(password)) {
    alert('❌ Weak Password!\nPassword must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
    return;
  }
    // Check if user already exists
    let users = getStoredUsers();
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert('⚠️ Account already exists on this email.');
        return;
    }

    users.push({ username, email, password });
    saveUsers(users);
    alert('✅ Registration successful! You can now log in.');
    container.classList.remove('active'); // switch to login view

    // Clear registration form
    document.getElementById('register-username').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
}

function handleLogin(event) {
    event.preventDefault(); // prevent form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = getStoredUsers();
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('signedInUser', user.username);
        localStorage.setItem('userEmail', user.email);

        alert('✅ Login Successful! Welcome, ' + user.username);
        window.location.href = 'dashboard.html'; // redirect to dashboard
    } else {
        alert('⚠️ Invalid email or password. Please try again.');
    }
}

// Validation Functions
function isValidUsername(username) {
    // letters, digits, underscores, 3-25 characters
    const usernamePattern = /^[A-Za-z0-9_]{3,25}$/;
    return usernamePattern.test(username);
}

function isValidEmail(email) {
    // basic email pattern
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$#%*?&^!])[A-Za-z0-9@$#%*?&^!]{8,30}$/;
    return passwordPattern.test(password);
}