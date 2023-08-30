/*eslint-disable*/
const userUpdateFrom = document.querySelector('.form-user-data');

if (userUpdateFrom) {
    userUpdateFrom.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInp = document.getElementById('name');
        const emailInp = document.getElementById('email');
        updateUserData(nameInp, emailInp);
    });
}

async function updateUserData(nameInp, emailInp) {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:8000/api/v1/users/updateMe`,
            data: {
                name: nameInp,
                email: emailInp,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'User Details Updated Successfully');
            window.setTimeout(function () {
                location.reload(true);
            }, 1500);
        }
    } catch (error) {
        console.log(error);
        showAlert('error', 'Error in Updateing User Details! Try again');
    }
}
