// handlers.mjs
import {
  homePage,
  aboutPage,
  contactPage,
  notFoundPage,
  formConfirmationPage,
  badRequestPage,
  serverErrorPage
} from './htmlPages.mjs';
import { validateFormData } from './validateForm.mjs';
import { parse as parseQuery } from 'querystring';

function setHeaders(res, body, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
  });
}

export function handleHome(res) {
  const body = homePage();
  setHeaders(res, body);
  res.end(body);
}

export function handleAbout(res) {
  const body = aboutPage();
  setHeaders(res, body);
  res.end(body);
}

export function handleContact(res) {
  const body = contactPage();
  setHeaders(res, body);
  res.end(body);
}

export function handleNotFound(res) {
  const body = notFoundPage();
  setHeaders(res, body, 404);
  res.end(body);
}

export function handle405(res) {
  const body = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>405 Method Not Allowed</title></head><body><h1>Method Not Allowed</h1></body></html>';
  setHeaders(res, body, 405);
  res.end(body);
}

export function handleSubmit(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
    if (data.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    let formData;
    try {
      formData = parseQuery(data);
    } catch (e) {
      const body = serverErrorPage();
      setHeaders(res, body, 500);
      res.end(body);
      return;
    }
    if (typeof formData !== 'object' || formData === null) {
      const body = serverErrorPage();
      setHeaders(res, body, 500);
      res.end(body);
      return;
    }
    try {
      if (!validateFormData(formData)) {
        const body = badRequestPage();
        setHeaders(res, body, 400);
        res.end(body);
        return;
      }
      const body = formConfirmationPage(formData.name, formData.email);
      setHeaders(res, body);
      res.end(body);
    } catch (err) {
      const body = serverErrorPage();
      setHeaders(res, body, 500);
      res.end(body);
    }
  });
}
