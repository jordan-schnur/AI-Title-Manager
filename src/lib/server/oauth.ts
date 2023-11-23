import { env } from '$env/dynamic/private';
import qs from 'qs';
import { defaultAxiosInstance } from './axios';
import client, { RedisEntry } from './redis';
import type { AxiosError } from 'axios';

export type OAuth = {
	access_token: string;
	expires: number | null;
	refresh_token: string;
};

type OAuthRefreshBody = {
	access_token: string;
	refresh_token: string;
	scope: string[];
	token_type: string;
};

export async function refreshToken(oauth: OAuth) {
	console.log('Refreshing Token');

	const axiosClient = defaultAxiosInstance();
	const clientId = env.VITE_TWITCH_CLIENT_ID;
	const clientSecret = env.VITE_TWITCH_APPLICATION_SECRET;

	let data = qs.stringify({
		client_id: clientId,
		client_secret: clientSecret,
		grant_type: 'refresh_token',
		refresh_token: oauth.refresh_token
	});

	const response = await axiosClient
		.post('https://id.twitch.tv/oauth2/token', data, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
		.then((response) => {
			let data: OAuthRefreshBody = response.data as OAuthRefreshBody;
			let oauth: OAuth = {
				access_token: data.access_token,
				refresh_token: data.refresh_token,
				expires: null
			};

			client.set(RedisEntry.oauth, JSON.stringify(oauth));
		})
		.catch((err: AxiosError) => {
			if (+(err.code ?? '') == 401) {
				console.log('Timed out try again');
			} else {
				console.log('Unknown err %e', err);
			}
		});
}

export async function getOAuth(): Promise<OAuth> {
	let redisOauth = await client.get(RedisEntry.oauth);
	let oauth = JSON.parse(redisOauth ?? '') as OAuth;

	return oauth;
}
