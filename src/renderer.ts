const ipcRenderer = require("electron").ipcRenderer

const USER_INFO_URL = 'https://login.yandex.ru/info';
const authButton = getHtmlElement('authBtn');
const logoutButton = getHtmlElement('logoutBtn');

logoutButton.onclick = () => {
    ipcRenderer.send('logout');
}

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
    logoutButton.hidden = false;
});

ipcRenderer.on('logout-processed', () => {
    logoutButton.hidden = true;
    getHtmlElement('tokenLabel').innerText = '';
    getHtmlElement('expiresLabel').innerText = '';
    getHtmlElement('exampleHeader').innerText = '';
    getHtmlElement('infoBlock').hidden = true;
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