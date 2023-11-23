import { createClient } from 'redis';

export enum RedisEntry {
	code = 'CODE',
	oauth = 'OAUTH'
}

const client = createClient({
	url: 'redis://localhost:6379' // Replace with your Redis server URI
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export default client;
