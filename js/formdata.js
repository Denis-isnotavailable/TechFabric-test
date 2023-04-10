import {isValidEmail} from './utils/formutils.js';

const user = {
    nickName: "",
    name: "",
    email: ""
}

const registerForm = document.querySelector(".form");

registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const {
        elements: { nickname, name, email }
    } = e.currentTarget;

    user.nickName = nickname.value;
    user.name = name.value;
    user.email = email.value;

    const isEmptyFields = !isValidEmail(email.value) && nickname.value === "" && name.value === "";

    if (!isEmptyFields) {
        localStorage.setItem("user", JSON.stringify(user));
        document.location.href = "./game.html";
    }
});