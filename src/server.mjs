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

function handleHome(res) {
	const body = homePage();
	setHeaders(res, body);
	res.end(body);
}

function handleAbout(res) {
	const body = aboutPage();
	setHeaders(res, body);
	res.end(body);
}

function handleContact(res) {
	const body = contactPage();
	setHeaders(res, body);
	res.end(body);
}

function handleNotFound(res) {
	const body = notFoundPage();
	setHeaders(res, body, 404);
	res.end(body);
}

function handle405(res) {
	const body = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>405 Method Not Allowed</title></head><body><h1>Method Not Allowed</h1></body></html>';
	setHeaders(res, body, 405);
	res.end(body);
}

function handleSubmit(req, res) {
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

const server = http.createServer((req, res) => {
	const parsedUrl = parseUrl(req.url, true);
	const method = req.method;
	const pathname = parsedUrl.pathname;

	if (method === 'GET') {
		if (pathname === '/') {
			handleHome(res);
		} else if (pathname === '/about') {
			handleAbout(res);
		} else if (pathname === '/contact') {
			handleContact(res);
		} else {
			handleNotFound(res);
		}
		return;
	}

	if (method === 'POST' && pathname === '/submit') {
		handleSubmit(req, res);
		return;
	}

	if (method === 'POST') {
		handleNotFound(res);
		return;
	}

	handle405(res);
});

server.listen(PORT, () => {
	if (process.env.NODE_ENV !== 'test') {
		console.log(`Server running on port ${PORT}`);
	}
});

// Обов'язково експортувати створений сервер для тестів
export { server };
