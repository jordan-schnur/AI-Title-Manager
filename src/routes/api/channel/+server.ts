import client from '$lib/server/redis';
import type { RequestHandler } from '@sveltejs/kit';
import { RedisEntry } from '$lib/server/redis';
import { defaultAxiosInstance } from '$lib/server/axios';
import { env } from '$env/dynamic/private';
import qs from 'qs';
import type { OAuth } from '$lib/server/oauth';
import { getChannelInformation, getUser } from '$lib/server/twitchapi';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const broadcaster_id = env.VITE_BROADCASTER_ID;
	let channelInfo = await getChannelInformation(+broadcaster_id);

	console.log('Setting shit up');
	let data = JSON.stringify(channelInfo);
	console.log('Information', data);
	return new Response(data, {
		headers: { 'Content-Type': 'application/json' },
		status: 200
	});
}
