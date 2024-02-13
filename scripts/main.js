const API_BASE_URL = "https://localhost:7028/";

const ENDPOINTS = {
    movies: API_BASE_URL + "api/Movies/",
    reviews: API_BASE_URL + "api/MovieReviews/",
    login: API_BASE_URL + "login",
    register: API_BASE_URL + "register",
    deleteMovie: (id) => API_BASE_URL + `api/Movies/${id}`,
    editMovie: (id) => API_BASE_URL + `api/Movies/${id}`,
    createMovie: API_BASE_URL + "api/Movies",
    addReview: API_BASE_URL + "api/MovieReviews/",
    deleteReview: (id) => API_BASE_URL + `api/MovieReviews/${id}`,
    editReview: (id) => API_BASE_URL + `api/MovieReviews/${id}`,
};

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    try {
        const response = await fetch(ENDPOINTS.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('success!')
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                window.location.href = "/index.html";
            } else {
                alert("Login failed. Access token not found in response.");
            }
        } else {
            alert("Login failed. Please check your email and password.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred. Please try again.");
    }
});

const showLoginSection = () => {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('logoutSection').style.display = 'none';
    console.log('logged out!')
};

const showLogoutSection = () => {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('logoutSection').style.display = 'flex';
    console.log('logged in!')
};

const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
    showLogoutSection();
} else {
    showLoginSection();
}

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    window.location.href = "/index.html";
});


const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;

    try {
        const response = await fetch(ENDPOINTS.register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                alert("Registration successful! Please log in.");
            } else {
                alert("Registration failed. " + data.message);
            }
        } else {
            alert("Registration failed. Please try again later.");
        }
    } catch (error) {
        console.error("An error occurred during registration:", error);
        alert("An error occurred during registration. Please try again later.");
    }
});
