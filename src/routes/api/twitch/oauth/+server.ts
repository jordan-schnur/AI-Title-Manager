import client from '$lib/server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import { RedisEntry } from '$lib/server/redis';
import { defaultAxiosInstance } from '$lib/server/axios';
import { env } from '$env/dynamic/private';

export type SaveCode = {
	code: string;
};

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	console.log('OAUTH');
	if (!request.body) {
		return new Response('You must send the code. ', {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}

	let body = await request.json();

	console.log('Body');

	return new Response('', {
		headers: { 'Content-Type': 'application/json' },
		status: 200
	});
}
