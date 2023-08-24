const alert = document.querySelector('.alertWrapper');
const userIdField = document.getElementById('userIdField');
const passwordField = document.getElementById('passwordField');
const signupForm = document.querySelector('.signupForm');
const formAlert = document.querySelector('.formAlert');

const closeAlert = () => {
    alert.classList.add('fade');
    setTimeout(() => {
        alert.style.display = 'none';
    }, 500);
};

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = userIdField.value;
    const password = passwordField.value;
    const filterIdAndPass = /^[a-zA-Z0-9]{8,}$/;

    if (!id.match(filterIdAndPass)) {
        formAlert.style.display = 'block';
        formAlert.innerText = 'ID không hợp lệ!';
    } else if (!password.match(filterIdAndPass)) {
        formAlert.style.display = 'block';
        formAlert.innerText = 'Mật khẩu phải chứa tối thiểu 8 ký tự bao gồm: a-z, A-Z, 0-9';
    } else {
        signupForm.submit();
    }
});
