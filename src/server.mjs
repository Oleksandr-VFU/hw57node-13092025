
import http from 'http';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';
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

const PORT = process.env.PORT || 3000;

function setHeaders(res, body, statusCode = 200) {
	res.writeHead(statusCode, {
		'Content-Type': 'text/html; charset=utf-8',
		'Content-Length': Buffer.byteLength(body),
		'X-Content-Type-Options': 'nosniff',
	});
}

const server = http.createServer((req, res) => {
	const parsedUrl = parseUrl(req.url, true);
	const method = req.method;
	const pathname = parsedUrl.pathname;

// Обов'язково експортувати створений сервер для тестів
export { server };
