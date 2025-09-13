
import http from 'http';
import { parse as parseUrl } from 'url';
import {
	handleHome,
	handleAbout,
	handleContact,
	handleNotFound,
	handle405,
	handleSubmit
} from './handlers.mjs';

const PORT = process.env.PORT || 3000;

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
