# electron-yandex-oauth-example
Пример приложения Electron использующего Яндекс OAuth

## Для запуска

Для клонирования и запуска вам потребуется [Git](https://git-scm.com) и [Node.js](https://nodejs.org/en/download/) (который поставляется с [npm](http://npmjs.com)) установленные на ваш компьютер. Из вашей командной строки:

```bash
# Клонируйте репозиторий
git clone https://github.com/ipanagushin/electron-yandex-oauth-example.git
# Перейдите в папку с клонированным репозиторием
cd electron-yandex-oauth-example
# Установка зависимостей
npm install
# Запуск приложения
npm run start
```

> При возникновении ошибки `The display compositor is frequently crashing. Goodbye.`
```bash
npm run start:xwayland
```

## Конфигурирование

> [Создайте](https://oauth.yandex.ru/client/new) приложение яндекс 

![](public/create-app.gif)

> После создания приложения у вас будет `ClientId` и указанный вами `RedirectUrl`, которые нужно указать в `main.ts`