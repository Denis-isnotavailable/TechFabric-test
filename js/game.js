import { createAttack, createAttackVisualButton, hideAttackVisualButton } from './utils/gameutils.js';
import { monstersImages } from './assets/monsters.js';
import { modalMessagesVariants, modalButtonVariants, rulles } from './assets/modaldata.js';

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    level: 1,
    score: 0,
    userHp: 3,
    monsterHp: 2
};


const userData = document.querySelectorAll(".header__data-item");
userData[0].innerHTML = user.nickName;
userData[1].innerHTML = `Level: ${initialState.level}`;
userData[2].innerHTML = `Score: ${initialState.score}`;

const roundButton = document.querySelector(".round-button");
const rullesButton = document.querySelector(".rules-button");
const modal = document.querySelector("[data-modal]");
const modalMessage = document.querySelector(".modal-message");
const modalButton = document.querySelector(".modal-button");

const defenceMonsterButtons = document.querySelectorAll(".defence-monster-button");
const monsterDefenceHpStatus = document.querySelector(".monster-defence-hp");
monsterDefenceHpStatus.innerHTML = initialState.userHp;

const monsterAttackImage = document.querySelector(".monster-attack-img");
const attackMonsterButtons = document.querySelectorAll(".attack-monster-button");
const monsterAttackHpStatus = document.querySelector(".monster-attack-hp");
monsterAttackHpStatus.innerHTML = initialState.monsterHp;



roundButton.addEventListener("click", e => {
    initialState.score += 1;

    e.target.setAttribute("disabled", true);

    userAttack(attackMonsterButtons, monsterAttackHpStatus);

    userData[2].innerHTML = `Score: ${initialState.score}`;
});


rullesButton.addEventListener("click", handleShowRulles);


function userAttack(opponent, opponentStatus) {   
    let isNotClicked = true;
    const { button, attackPoints } = createAttack();    

    createAttackVisualButton(opponent[button], attackPoints);   

    opponent[button].addEventListener("click", handleAttackClick);    

    setTimeout(() => {
        isNotClicked && hideAttackVisualButton(opponent[button]);

        opponent[button].removeEventListener("click", handleAttackClick);        
        isNotClicked && monsterAttack(defenceMonsterButtons, monsterDefenceHpStatus);
       
    }, 2000);

    // Action on Attack-Button click

    function handleAttackClick(e) {       
        isNotClicked = false;        

        initialState.monsterHp -= attackPoints; 
        opponentStatus.innerHTML = initialState.monsterHp; 
        
        hideAttackVisualButton(e.target);

        if (initialState.level === 5 && initialState.monsterHp <= 0) {
            modalScreen(modalMessagesVariants[1], modalButtonVariants[0]);
            unlockRoundBtnAndModalBtn();

        } else if (initialState.monsterHp <= 0) { 
            modalScreen(modalMessagesVariants[0], modalButtonVariants[1]);
            unlockRoundBtnAndModalBtn();

        } else {
            setTimeout(() => { monsterAttack(defenceMonsterButtons, monsterDefenceHpStatus); }, 1000);
        }
    };
};

function monsterAttack(opponent, opponentStatus) {
    const { button, attackPoints } = createAttack();

    createAttackVisualButton(opponent[button], attackPoints);  

    setTimeout(() => {
        hideAttackVisualButton(opponent[button]);
        initialState.userHp -= attackPoints;
        opponentStatus.innerHTML = initialState.userHp;

        roundButton.removeAttribute("disabled");

        if (initialState.userHp <= 0) {
            modalScreen(modalMessagesVariants[2], modalButtonVariants[0]);
            modalButton.addEventListener("click", handleLevelUpOrRestart);
        }
    }, 1000);
};


const handleLevelUpOrRestart = e => {
    const isWin = e.target.textContent === "Next Level" ? true : false;

    if (isWin) {
        initialState.level += 1;
    } else {
        initialState.level = 1;
        initialState.score = 0;
        userData[2].innerHTML = `Score: ${initialState.score}`;
    }

    initialState.userHp = initialState.level + 2;
    initialState.monsterHp = initialState.level + 1;
    userData[1].innerHTML = `Level: ${initialState.level}`;
    monsterDefenceHpStatus.innerHTML = initialState.userHp;
    monsterAttackHpStatus.innerHTML = initialState.monsterHp;
    monsterAttackImage.setAttribute("src", monstersImages[initialState.level - 1]);
    modal.classList.add("drop-bg--is-hidden");

    modalButton.removeEventListener("click", handleLevelUpOrRestart);
};

const modalScreen = (message, buttonName) => {
    modal.classList.remove("drop-bg--is-hidden");            
    modalMessage.innerHTML = message;
    modalButton.innerHTML = buttonName;
}

const unlockRoundBtnAndModalBtn = () => {
    roundButton.removeAttribute("disabled");
    modalButton.addEventListener("click", handleLevelUpOrRestart);
}

function handleShowRulles() {
    modalScreen(rulles, "Close");
    modalButton.addEventListener("click", handleCloseRules);
}

function handleCloseRules() {
    modal.classList.add("drop-bg--is-hidden");
    modalButton.removeEventListener("click", handleCloseRules);
}

