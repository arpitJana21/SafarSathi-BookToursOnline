/*eslint-disable*/
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

async function login(email, password) {
    try {
        const res = await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/api/v1/users/login`,
            data: {
                email: email,
                password: password,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in Successfully');
            window.setTimeout(function () {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
}

function showAlert(type, msg) {
    hideAlert();
    const markUp = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
    window.setTimeout(hideAlert, 5000);
}

function hideAlert() {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }
}

async function logout() {
    try {
        const res = await axios({
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users/logout`,
        });
        if (res.data.status === 'success') {
            location.reload(true);
        }
    } catch (error) {
        console.log(error);
        showAlert('error', 'Error logging out! Try again');
    }
}
