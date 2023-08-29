/*eslint-disable*/
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
            alert('Logged in successfully');
            window.setTimeout(function () {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        alert(error.response.data.message);
    }
}

const loginForm = document.querySelector('.form');

if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}
