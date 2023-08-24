const alert = document.querySelector('.alertWrapper');
const userIdField = document.getElementById('userIdField');
const passwordField = document.getElementById('passwordField');
const loginForm = document.querySelector('.loginForm');
const formAlert = document.querySelector('.formAlert');

const closeAlert = () => {
    alert.classList.add('fade');
    setTimeout(() => {
        alert.style.display = 'none';
    }, 500);
};

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = userIdField.value;
    const password = passwordField.value;
    const condition = /^[a-zA-Z0-9]{8,}$/;
    if (id.match(condition) && password.match(condition)) {
        loginForm.submit();
    } else {
        formAlert.style.display = 'block';
    }
});
