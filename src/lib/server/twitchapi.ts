import { env } from '$env/dynamic/private';
import qs from 'qs';
import { createOauthAxiosInstance, defaultAxiosInstance } from './axios';
import client, { RedisEntry } from './redis';
import type { AxiosError } from 'axios';
import { getOAuth } from './oauth';
import { ChannelInfoType } from '$lib/twitch';

export type UserRequest = {
	id?: number[] | undefined;
	login?: string[] | undefined;
};

export type User = {
	id: string;
	login: string;
	display_name: string;
	type: 'admin' | 'global_mod' | 'staff' | '';
	broadcaster_type: 'affiliate' | 'partner' | '';
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number; // Note: Deprecated
	email: string;
	created_at: string;
};

export type UserResponse = {
	data: User[];
};

export async function getUser(userRequest: UserRequest) {
	const oauth = await getOAuth();
	const axiosClient = createOauthAxiosInstance(oauth);

	console.log('Getting User');

	let queryParams = new URLSearchParams();

	const id = userRequest.id;
	const login = userRequest.login;
	if (id) {
		id.forEach((i) => queryParams.append('id', i.toString()));
	}

	if (login) {
		login.forEach((l) => queryParams.append('login', l));
	}

	let url = `https://api.twitch.tv/helix/users?${queryParams.toString()}`;

	console.log('Final URL', url);

	const users: UserResponse = await axiosClient
		.get(`https://api.twitch.tv/helix/users?${queryParams.toString()}`)
		.then((response) => {
			console.log('Returned 200, data: ', response.data);
			return response.data;
		})
		.catch((err: AxiosError) => {
			let status: number = err.data.status;
			console.log('Error? ', err);
			if (+(err.code ?? 0) === 400) {
				console.log(
					'The id or login query parameter is required unless the request uses a user access token or The request exceeded the maximum allowed number of id and/or login query parameters.'
				);
			} else if (+(err.code ?? 0) === 401) {
				console.log(`
The Authorization header is required and must contain an app access token or user access token.
The access token is not valid.
The ID specified in the Client-Id header does not match the client ID specified in the access token.`);
			}
		});

	console.log('leaving here');

	return users ?? [];
}

export type ChannelInfoResponse = {
	data: ChannelInfoType[];
};

export async function getChannelInformation(broadcasterId: number) {
	const oauth = await getOAuth();
	const axiosClient = createOauthAxiosInstance(oauth);

	console.log('Getting Channel Information');

	let url = `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`;

	console.log('Final URL', url);

	const channel: ChannelInfoResponse = await axiosClient
		.get(url)
		.then((response) => {
			return response.data;
		})
		.catch((err: AxiosError) => {
			let status = err.response?.status || 0; // Assuming 'err' is the error object from Axios
			console.log('Error? ', err);

			switch (status) {
				case 400:
					console.log(
						'Bad Request: The broadcaster_id query parameter is required. The broadcaster ID is not valid, or the number of broadcaster_id query parameters exceeds the maximum allowed.'
					);
					break;
				case 401:
					console.log(`
Unauthorized: 
- The Authorization header is required and must specify an app access token or user access token.
- The OAuth token is not valid.
- The ID in the Client-Id header must match the Client ID in the OAuth token.`);
					break;
				case 429:
					console.log(
						'Too Many Requests: The application exceeded the number of calls it may make per minute. Check the Rate Limits.'
					);
					break;
				case 500:
					console.log('Internal Server Error: A server-side error occurred. Try again later.');
					break;
				default:
					console.log(`An unexpected error occurred: ${status}`);
					break;
			}
		});

	return channel.data[0] ?? {};
}
