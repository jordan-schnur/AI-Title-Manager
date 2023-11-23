import client from '$lib/server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import { RedisEntry } from '$lib/server/redis';
import { defaultAxiosInstance } from '$lib/server/axios';
import { env } from '$env/dynamic/private';
import qs from 'qs';
import type { OAuth } from '$lib/server/oauth';
import { getUser } from '$lib/server/twitchapi';

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
	let users = getUser({
		login: ['Zyneak']
	});

	return new Response(JSON.stringify(users), {
		headers: { 'Content-Type': 'application/json' },
		status: 200
	});
}
