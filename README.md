
# Node.js HTTP Server (ДЗ #4)

## Встановлення та запуск

1. Встановіть залежності:
	 ```
	 yarn
	 # або
	 npm install
	 ```
2. Запустіть сервер:
	 ```
	 node ./src/server.mjs
	 ```
	 Сервер за замовчуванням слухає порт 3000. Для зміни порту використовуйте змінну середовища `PORT`.

## Маршрути

### GET

- `/` — Головна сторінка
	- Відповідь: HTML з заголовком "Home" і текстом "Welcome to the Home Page"
- `/about` — Про нас
	- Відповідь: HTML з "About" і "Learn more about us"
- `/contact` — Контакти
    - Відповідь: HTML з "Contact" і "Get in touch"
    - На сторінці відображається форма для введення імені та email користувача
    - Форма проходить базову валідацію на стороні і браузера і сервера (перевірка наявності і коректності email)
    - Після відправки форми дані обробляються маршрутом `/submit`
- Інші маршрути — 404 Not Found (HTML з "Page Not Found")

### POST

- `/submit` — Приймає форму (Content-Type: application/x-www-form-urlencoded)
	- Очікує поля: `name`, `email`
	- Коректні дані: HTML з підтвердженням (ім'я та email)
	- Некоректні дані: 400 Bad Request (HTML з "Invalid form data")

## Приклади запитів

**GET**
```
curl http://localhost:3000/
curl http://localhost:3000/about
curl http://localhost:3000/contact
curl http://localhost:3000/unknown
```

**POST**
```
curl -X POST http://localhost:3000/submit -d "name=Ivan&email=ivan@email.com" -H "Content-Type: application/x-www-form-urlencoded"
curl -X POST http://localhost:3000/submit -d "name=&email=" -H "Content-Type: application/x-www-form-urlencoded"
```

## Обмеження реалізації

- Максимальний розмір POST-запиту: ~1MB
- Валідація email — базова (перевірка формату)
- Використано лише вбудовані модулі Node.js (`http`, `url`, `querystring`)
- Без сторонніх бібліотек (Express тощо)

---

## Тестування

Запустіть тести:
```
yarn test
# або
npm test
```
