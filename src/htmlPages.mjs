// htmlPages.mjs

function getHtmlPage(title, heading, description) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>
  <body>
    <h1>${heading}</h1>
    <p>${description}</p>
  </body>
</html>`;
}

export function homePage() {
  return getHtmlPage('Home', 'Home', 'Welcome to the Home Page');
}

export function aboutPage() {
  return getHtmlPage('About', 'About', 'Learn more about us');
}

export function contactPage() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Contact</title>
  </head>
  <body>
    <h1>Contact</h1>
    <p>Get in touch</p>
    <form method="POST" action="/submit">
      <label>
        Name: <input type="text" name="name" required />
      </label>
      <br />
      <label>
        Email: <input type="email" name="email" required />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  </body>
</html>`;
}

export function notFoundPage() {
  return getHtmlPage('404 Not Found', '404 Not Found', 'Page Not Found');
}

export function formConfirmationPage(name, email) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Form Submitted</title>
  </head>
  <body>
    <h1>Form Submitted</h1>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
  </body>
</html>`;
}

export function badRequestPage() {
  return getHtmlPage('400 Bad Request', '400 Bad Request', 'Invalid form data');
}

export function serverErrorPage() {
  return getHtmlPage('500 Internal Server Error', 'Error 500', 'Server Error');
}
