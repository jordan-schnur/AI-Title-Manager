import client from '$lib/server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import { RedisEntry } from '$lib/server/redis';
import { defaultAxiosInstance } from '$lib/server/axios';
import { env } from '$env/dynamic/private';
import qs from 'qs';
import type { OAuth } from '$lib/server/oauth';

export type SaveCode = {
	code: string;
};

type OAuthBody = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string[];
	token_type: string;
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	if (!request.body) {
		console.log('Empty body');
		return new Response('You must send the code. ', {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}

	let body: SaveCode = await request.json();

	if (!body.code) {
		return new Response('You must send the code. ', {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}

	client.set(RedisEntry.code, body.code);

	const axiosClient = defaultAxiosInstance();

	const clientId = env.VITE_TWITCH_CLIENT_ID;
	const clientSecret = env.VITE_TWITCH_APPLICATION_SECRET;
	const oauthURL = env.VITE_TWITCH_OAUTH_REDIRECT;

	let data = qs.stringify({
		client_id: clientId,
		client_secret: clientSecret,
		code: body.code,
		grant_type: 'authorization_code',
		redirect_uri: oauthURL
	});
	const response = await axiosClient
		.post('https://id.twitch.tv/oauth2/token', data, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
		.then((response) => {
			let data: OAuthBody = response.data as OAuthBody;
			let oauth: OAuth = {
				access_token: data.access_token,
				refresh_token: data.refresh_token,
				expires: new Date(new Date().getTime() + data.expires_in * 1000).getTime()
			};

			client.set(RedisEntry.oauth, JSON.stringify(oauth));

			console.log('Oauth saved successfully');
		});

	return new Response('', {
		headers: { 'Content-Type': 'application/json' },
		status: 200
	});
}
