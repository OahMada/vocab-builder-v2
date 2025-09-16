import Cookies from 'js-cookie';

export function setCookie(name: string, value: string) {
	Cookies.set(name, value);
}

export function deleteCookie(name: string) {
	Cookies.remove(name);
}
