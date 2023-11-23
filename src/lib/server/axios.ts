import axios from 'axios';
import client from './redis';
import type { OAuth } from './oauth';
import { env } from '$env/dynamic/private';

export function createOauthAxiosInstance({ access_token }: OAuth) {
	const clientId = env.VITE_TWITCH_CLIENT_ID;
	return axios.create({
		headers: {
			Authorization: `Bearer ${access_token}`,
			'Client-Id': clientId
		}
	});
}

export function defaultAxiosInstance() {
	return axios.create();
}
