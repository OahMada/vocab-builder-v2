import Cookies from 'js-cookie';

export function setCookie(name: string, value: string) {
	Cookies.set(name, value, {
		expires: 1000,
	});
}

export function deleteCookie(name: string) {
	Cookies.remove(name);
}

export function readCookie(name: string) {
	return Cookies.get(name);
}
