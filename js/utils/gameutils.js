const randomButton = (max) => {
    return Math.floor(Math.random() * max);;
}

export const createAttack = () => {
    const button = randomButton(9);
    const attackPoints = randomButton(2) + 1;
    return { button, attackPoints };
}

export const createAttackVisualButton = (button, attackPoints) => {
    button.innerHTML = `Attack ${attackPoints}hp`;
    button.style.backgroundColor = "#980a0a";
    button.removeAttribute("disabled");
}

export const hideAttackVisualButton = (button) => {
    button.innerHTML = "";
    button.style.backgroundColor = "transparent";   
    button.setAttribute("disabled", true);
}