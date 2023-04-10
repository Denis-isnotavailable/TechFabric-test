import {isValidEmail} from './utils/formutils.js';

const user = {
    nickName: "",
    name: "",
    email: ""
}

const registerForm = document.querySelector(".form");
const emailError = document.querySelector(".email-error");

registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const {
        elements: { nickname, name, email }
    } = e.currentTarget;

    user.nickName = nickname.value;
    user.name = name.value;
    user.email = email.value;

    if (!isValidEmail(email.value)) {
        emailError.innerHTML = "use correct email"
    } else {
        emailError.innerHTML = "";
        localStorage.setItem("user", JSON.stringify(user));
        document.location.href = "game.html";
    }
});
