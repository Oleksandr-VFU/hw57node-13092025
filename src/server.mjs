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

	// POST маршрут
	if (method === 'POST' && pathname === '/submit') {
		let data = '';
		req.on('data', chunk => {
			data += chunk;
			// Захист від великих запитів
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
		return;
	}

	// POST на неіснуючі маршрути
	if (method === 'POST') {
		const body = notFoundPage();
		setHeaders(res, body, 404);
		res.end(body);
		return;
	}

	// 405 для інших методів
	const body = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>405 Method Not Allowed</title></head><body><h1>Method Not Allowed</h1></body></html>';
	setHeaders(res, body, 405);
	res.end(body);
});

server.listen(PORT, () => {
	if (process.env.NODE_ENV !== 'test') {
		console.log(`Server running on port ${PORT}`);
	}
});

// Обов'язково експортувати створений сервер для тестів
export { server };
