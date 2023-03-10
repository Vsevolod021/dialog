const input = document.querySelector('.input');
const dialogWindow = document.querySelector('.dialog');
const resultsWindow = document.querySelector('.results');
const inputText = document.querySelector('.input__text');
const inputCards = document.querySelector('.input__cards');
const inputButton = document.querySelector('.input__button');
const resultsStats = document.querySelector('.results__stats');
const resultsPercent = document.querySelector('.results__percent');
const repeatBtn = document.querySelector('.results__repeat-btn>button');

let variantCardsArray = [];
const chatHistory = [];

const botMessages = [
    {
        text: 'Привет!<br/>Не хочешь поучаствовать в квизе?',
        hasVariants: false,
    },
    {
        text: 'Вопрос 1',
        hasVariants: false,
    },
    {
        text: 'Вопрос 2',
        hasVariants: false,
    },
    {
        text: 'Вопрос 3',
        hasVariants: true,
        variants: ['вариант 1', 'вариант 2', 'вариант 3', 'вариант 4']
    },
    {
        text: 'Вопрос 4',
        hasVariants: true,
        variants: ['вариант 1', 'вариант 2', 'вариант 3']
    },
    { 
        text: 'Вопрос 5',
        hasVariants: false,
    }
];

const answers = ['ответ 1', 'ответ 2', 'вариант 3', 'вариант 1', 'ответ 5'];

let messageIndex = 0;
let botMessageIndex = 0;

// рендер компонентов страницы
function renderBotMessage() {
    chatHistory[messageIndex] = document.createElement('div');
    chatHistory[messageIndex].className = 'message-elem message-elem_bot';
    chatHistory[messageIndex].innerHTML = `${botMessages[botMessageIndex].text}`;
    dialogWindow.append(chatHistory[messageIndex]);
}

function renderUserMessage(messageText) {
    chatHistory[messageIndex] = document.createElement('div');
    chatHistory[messageIndex].className = 'message-elem message-elem_user';
    chatHistory[messageIndex].innerHTML = `${messageText}`;
    dialogWindow.append(chatHistory[messageIndex]);
}

function renderCards() {
    botMessages[botMessageIndex].variants.forEach((variant, index) => {
        variantCardsArray[index] = document.createElement('button');
        variantCardsArray[index].className = 'input__card';
        variantCardsArray[index].innerText = `${variant}`;
        inputCards.append(variantCardsArray[index]);
    });
}

function renderPercent(quizStats) {
    let rightAnswersArray = quizStats.filter(elem => elem.isRight);
    resultsPercent.innerText = `${ (rightAnswersArray.length / quizStats.length) * 100}%`;
}

function renderStats(quizStats) {
    quizStats.forEach(elem => {
        let statsElem = document.createElement('div');
       
        if (elem.isRight) {
            statsElem.className = 'stats__elem right';
            statsElem.innerHTML+=`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="24px"
                    height="24px"
                ><path
                    fill="#43A047"
                    d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"
                /></svg>`;
        } else {
            statsElem.className = 'stats__elem wrong';
            statsElem.innerHTML+=`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="24px"
                    height="24px"
                ><path
                    fill="#F44336"
                    d="M21.5 4.5H26.501V43.5H21.5z"
                    transform="rotate(45.001 24 24)"
                /><path
                    fill="#F44336"
                    d="M21.5 4.5H26.5V43.501H21.5z"
                    transform="rotate(135.008 24 24)"
                /></svg>
            `;
        }

        statsElem.innerHTML+=`
            <span>Ваш ответ: ${elem.givenAnswer}</span>
            <span>Правильный ответ: ${elem.rightAnswer}</span>
        `;

        resultsStats.append(statsElem);
    });
}

function renderResultsWindow() {
    let quizStats = getQuizStats();
    renderPercent(quizStats);
    renderStats(quizStats);
}

function renderStartLayout() {
    inputText.focus();
    renderBotMessage();
    botMessageIndex++;
}

function clearLayout() {
    dialogWindow.innerHTML = '';
    resultsStats.innerHTML = '';
    resultsPercent.innerHTML = '';
}

// логика компонентов
function toggleInput() {
    inputCards.classList.toggle('hidden');
    inputText.classList.toggle('hidden');
    inputButton.classList.toggle('hidden');

    if (input.classList.contains('input_text')) {
        input.classList.remove('input_text');
        input.classList.add('input_cards');
    } else {
        input.classList.remove('input_cards');
        input.classList.add('input_text');
    }  
}

function toggleWindows() {
    resultsWindow.classList.toggle('hidden');
    dialogWindow.classList.toggle('hidden');
    input.classList.toggle('hidden');
}

function getQuizStats() {
    let quizStats = [];

    answers.forEach((item, index) => {
        quizStats[index] = {};
        quizStats[index].givenAnswer = chatHistory[index + 1].innerText;
        quizStats[index].rightAnswer = item; 
        quizStats[index].isRight = ( 
            quizStats[index].givenAnswer == quizStats[index].rightAnswer 
        );
    });

    return quizStats;
}

function eventListenLogic(messageText) {
    if (messageText !== '') {
        renderUserMessage(messageText);
        inputText.value = '';
        messageIndex++;

        if (botMessageIndex < botMessages.length) {
            renderBotMessage();

            if (Boolean(botMessages[botMessageIndex - 1]?.hasVariants) !==
                botMessages[botMessageIndex]?.hasVariants) {
                toggleInput();
            }

            if (botMessages[botMessageIndex]?.hasVariants) {
                inputCards.innerHTML = '';
                renderCards();
            }
            
            botMessageIndex++;

        } else {
            toggleWindows();
            renderResultsWindow();
            return;
        }

        inputText.focus();
    }

    dialogWindow.scroll({
        top: dialogWindow.scrollHeight,
        behavior: 'smooth'
    });
}

function resetData() {
    chatHistory.splice(0);
    messageIndex = 0;
    botMessageIndex = 0;
}

// обработчики событий
inputButton.addEventListener('click', () => {
    eventListenLogic(inputText.value);
});

window.addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
        eventListenLogic(inputText.value);
    }
});

inputCards.addEventListener('click', event => {
    if (event.target.classList.contains('input__card')) {
        eventListenLogic(event.target.innerText);
        variantCardsArray = [];
    }
});

repeatBtn.addEventListener('click', () => { 
    clearLayout();
    resetData();
    toggleWindows();
    renderStartLayout()
});

window.onload = renderStartLayout;