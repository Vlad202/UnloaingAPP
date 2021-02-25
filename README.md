# UnloaingAPP
Мобильное приложение по контролю отгрузок товара.
API приложения [здесь](https://github.com/Vlad202/UnloaingAPP-API/)

В корне проекта создайте файл со следующим кодом
```javascript
const URL = 'Ссылка на API с указанием'
const URLS = {
    cli: `${URL}clients/`,
    auth: `${URL}account/`,
}

export default URLS;
```