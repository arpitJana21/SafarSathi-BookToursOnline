/* eslint-disable */
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
// UTILITY FUNCTIONS
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
function showAlert(type, msg) {
    hideAlert();
    const markUp = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
    window.setTimeout(hideAlert, 3000);
}

function hideAlert() {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }
}

async function updateSettings(data, type) {
    try {
        const url =
            type === 'password'
                ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword'
                : 'http://127.0.0.1:8000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url: url,
            data: data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
            window.setTimeout(function () {
                location.reload(true);
            }, 3000);
        }
    } catch (error) {
        showAlert('error', err.response.data.message);
    }
}
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
// DISPLAY MAP
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
const mapBox = document.getElementById('map');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);

    mapboxgl.accessToken =
        'pk.eyJ1IjoiYXJwaXRqYW5hMjEwMyIsImEiOiJjbGx2c3oydGgxd2k3M2t0aDVmZzdsNGxmIn0.t2GXGPH5VlxDKRuqgIq-ZQ';
    var map = new mapboxgl.Map({
        container: 'map',
        // style: 'mapbox://styles/mapbox/streets-v11',
        style: 'mapbox://styles/arpitjana2103/cllvtjnmo00dt01pecx465tx6',
        // style: 'mapbox://styles/arpitjana2103/cllvtoc9d00ep01qy5tv7fn2n',
        // center: [-118.113491, 34.111745],
        // zoom: 10,
        // interactive: false,
        scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(function (loc) {
        // Create Marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30,
            closeButton: false,
            maxWidth: '500px',
            className: 'mapPopUp',
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day} : ${loc.description}<p/>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: { top: 200, bottom: 150, left: 100, right: 100 },
    });
}
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
// LOGIN USER + LOGOUT USER
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
const loginForm = document.querySelector('.form--login');
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

async function logout() {
    try {
        const res = await axios({
            method: 'GET',
            url: `http://127.0.0.1:8000/api/v1/users/logout`,
        });
        if (res.data.status === 'success') {
            showAlert('success', 'LoggedOut Successfully');
            window.setTimeout(function () {
                location.assign('/');
            }, 3000);
        }
    } catch (error) {
        console.log(error);
        showAlert('error', 'Error logging out! Try again');
    }
}
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
// UPDATING USER DATA
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
const userUpdateFrom = document.querySelector('.form-user-data');

if (userUpdateFrom) {
    // const locations = JSON.parse(mapBox.dataset.locations);
    userUpdateFrom.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInp = document.getElementById('name');
        const emailInp = document.getElementById('email');
        const nameVal = nameInp.value;
        const emailVal = emailInp.value;
        // console.log(nameInp.dataset.name);
        // const currUserName = nameInp.dataset.name;
        // const currUserEmail = emailInp.dataset.email;
        // if (nameVal === currUserName && emailVal === currUserEmail) {
        //     showAlert('error', 'Kindly Enter Your New Details');
        //     return;
        // }
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });
}
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
// UPDATING USER PASSWORD
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
const userUpdatePassFrom = document.querySelector('.from-user-password');

if (userUpdatePassFrom) {
    // const locations = JSON.parse(mapBox.dataset.locations);
    userUpdatePassFrom.addEventListener('submit', async function (e) {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        const currPass = document.getElementById('password-current');
        const newPass = document.getElementById('password');
        const newPassConfirm = document.getElementById('password-confirm');
        await updateSettings(
            {
                passwordCurrent: currPass.value,
                password: newPass.value,
                passwordConfirm: newPassConfirm.value,
            },
            'password',
        );
        currPass.value = null;
        newPass.value = null;
        newPassConfirm.value = null;
        document.querySelector('.btn--save-password').textContent =
            'Save password';
    });
}
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
// STRIPE
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
async function bookTour(tourID, e) {
    try {
        const stripe = Stripe(
            'pk_test_51NlMh1SJzVtls1wv0Nykwdrq589ZeXwyCjfKtByXHhGiljs7HPgPt9gfYvGRTsJpKmPPApIdRwd4unXDY5xLV3d800kaHj3WT5',
        );

        // Get CheckOut Scssion From API
        const session = await axios(
            `http://127.0.0.1:8000/api/v1/booking/checkout-session/${tourID}`,
        );

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        e.target.textContent = 'Book Tour Now!';
        showAlert('error', error.response.data.message);
    }

    // Create Checkout form
    console.log(session);
}

const bookBtn = document.getElementById('book-tour');
if (bookBtn) {
    bookBtn.addEventListener('click', function (e) {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId, e);
    });
}
