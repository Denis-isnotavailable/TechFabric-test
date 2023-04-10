import { createAttack, createAttackVisualButton, hideAttackVisualButton } from './utils/gameutils.js';
import { monstersImages } from './assets/monsters.js';
import { modalMessagesVariants, modalButtonVariants, rules } from './assets/modaldata.js';

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    level: 1,
    score: 0,
    userHp: 3,
    monsterHp: 2
};

// Set initial info - user name, level, score
const userData = document.querySelectorAll(".header__data-item");
userData[0].innerHTML = user.nickName;
userData[1].innerHTML = `Level: ${initialState.level}`;
userData[2].innerHTML = `Score: ${initialState.score}`;

// Get elements: Round button, Rules button, Modal window, Modal message, Modal Close/Next Level button
const roundButton = document.querySelector(".round-button");
const rulesButton = document.querySelector(".rules-button");
const modal = document.querySelector("[data-modal]");
const modalMessage = document.querySelector(".modal-message");
const modalButton = document.querySelector(".modal-button");

// Get elements: Player's monster (defence) attack buttons for random chosing for enemy attacks,
// Player's monster (defence) HP number
// Set HP level for player monster
const defenceMonsterButtons = document.querySelectorAll(".defence-monster-button");
const monsterDefenceHpStatus = document.querySelector(".monster-defence-hp");
monsterDefenceHpStatus.innerHTML = initialState.userHp;

// Get elements: Enemy monster (attack) attack buttons for random chosing for player's attacks,
// Enemy monster HP number
// Set HP level for Enemy monster
const monsterAttackImage = document.querySelector(".monster-attack-img");
const attackMonsterButtons = document.querySelectorAll(".attack-monster-button");
const monsterAttackHpStatus = document.querySelector(".monster-attack-hp");
monsterAttackHpStatus.innerHTML = initialState.monsterHp;


// Listener for Round button:
// incrementing score
// make Round btn disabled till round end
// show the opportunity for player attack
// write score data in header
roundButton.addEventListener("click", e => {
    initialState.score += 1;

    e.target.setAttribute("disabled", true);

    userAttack(attackMonsterButtons, monsterAttackHpStatus);

    userData[2].innerHTML = `Score: ${initialState.score}`;
});

// Listener for Rules button: onClick open modal window
// On click Close btn - close modal with rules
rulesButton.addEventListener("click", handleShowRules);


function userAttack(opponent, opponentStatus) { 
    // variable to define did player do attack
    let isNotClicked = true;
    //create number of button for attack & number of lost HP per attack
    const { button, attackPoints } = createAttack();    

    // make button with rundom chosen number clickable and show attack strength - lost HP
    createAttackVisualButton(opponent[button], attackPoints);   

    // Listener for attack button with rundom chosen number
    opponent[button].addEventListener("click", handleAttackClick);    

    // if player did not attack make attack button with rundom chosen number disabled
    // and start monster attack method (isNotClicked boolean depending)
    setTimeout(() => {
        isNotClicked && hideAttackVisualButton(opponent[button]);

        opponent[button].removeEventListener("click", handleAttackClick);        
        isNotClicked && monsterAttack(defenceMonsterButtons, monsterDefenceHpStatus);
       
    }, 2000);

    // Action on Attack-Button click

    function handleAttackClick(e) {
        // if player did attack (isNotClicked boolean depending) isNotClicked - false
        isNotClicked = false;        

        // rewrite monster HP depending on attack strength
        initialState.monsterHp -= attackPoints; 
        opponentStatus.innerHTML = initialState.monsterHp; 
        
        // attack button with rundom chosen number disabled
        hideAttackVisualButton(e.target);

        // if level number is 5 and monster is dead - win the game
        // if monster is dead and level less than 5 - next level
        // else monster attacks method
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

    // To show monsters attack - attack btn is active for one second
    // after it user HP changing & rewriting in header
    // if player's HP less than 0 or 0 - show modal about losing and suggest to stert new game
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

// if level up - rewrite all data but not the score for next level
// if lose or win all monsters rewrite all data to start from level 1
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

function handleShowRules() {
    modalScreen(rules, "Close");
    modalButton.addEventListener("click", handleCloseRules);
}

function handleCloseRules() {
    modal.classList.add("drop-bg--is-hidden");
    modalButton.removeEventListener("click", handleCloseRules);
}

