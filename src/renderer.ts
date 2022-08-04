const ipcRenderer = require("electron").ipcRenderer

const USER_INFO_URL = 'https://login.yandex.ru/info';
const authButton = getHtmlElement('authBtn');

authButton.onclick = () => {
    openLoginWindow();
};

function openLoginWindow() {
    ipcRenderer.send('auth-window');
}

ipcRenderer.on('auth-info', function (event, info) {
    let date = new Date();
    date.setSeconds(date.getSeconds() + info.expires);
    getHtmlElement('tokenLabel').innerText = `Ваш токен: ${info.token}`;
    getHtmlElement('expiresLabel').innerText = `Истечет: ${date}`;
    getHtmlElement('exampleHeader').innerText = `Authorization: OAuth ${info.token}`;
    getHtmlElement('infoBlock').hidden = false;
    getHtmlElement('testFetch').onclick = () => {
        fetchUserInfoFunc(info.token);
    };
});

function fetchUserInfoFunc(token: string) {
    fetch(USER_INFO_URL, {
        "headers": {
            'Authorization': `OAuth ${token}`
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "method": "GET"
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.info(data);
            getHtmlElement('fetchResult').innerHTML = JSON.stringify(data, null, "\t");;
        });
}

function getHtmlElement(id: string): HTMLElement {
    return document.getElementById(id);
}