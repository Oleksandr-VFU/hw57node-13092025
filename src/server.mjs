
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

	// GET маршрути
	if (method === 'GET') {
		let body;
		if (pathname === '/') {
			body = homePage();
			setHeaders(res, body);
			res.end(body);
		} else if (pathname === '/about') {
			body = aboutPage();
			setHeaders(res, body);
			res.end(body);
		} else if (pathname === '/contact') {
			body = contactPage();
			setHeaders(res, body);
			res.end(body);
		} else {
			body = notFoundPage();
			setHeaders(res, body, 404);
			res.end(body);
		}
		return;
	}



server.listen(PORT, () => {
	if (process.env.NODE_ENV !== 'test') {
		console.log(`Server running on port ${PORT}`);
	}
});

// Обов'язково експортувати створений сервер для тестів
export { server };
