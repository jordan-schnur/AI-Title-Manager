<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { redirect } from '@sveltejs/kit';

	let state = '';
	let urlParams;
	let errResponse = false;
	let successResponse = false;
	let countDown = 5;

	let message: string | null = null;
	let apiError = false;

	onMount(() => {
		const savedState = localStorage.getItem('appState');

		if (savedState) {
			state = savedState;
		} else {
			state = generateState();
			localStorage.setItem('appState', state);
		}

		urlParams = new URLSearchParams(window.location.search);

		urlParams.forEach((value, key) => {
			console.log(key + ':' + value);
		});

		if (urlParams.has('error')) {
			errResponse = true;
		}

		if (urlParams.has('code')) {
			successResponse = true;

			axios
				.post('/api/twitch/code', { code: urlParams.get('code') })
				.then(() => {
					const interval = setInterval(() => {
						countDown -= 1;
						if (countDown === 0) {
							clearInterval(interval);

							location.href = '/app';
						}
					}, 1000);
				})
				.catch((err) => {
					console.log(err);
					message = 'Failed to save code';
				});
		}
	});

	function generateState() {
		return Math.random().toString(36).substring(2, 15); // Generates a random string
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Twitch Title Manager" />
</svelte:head>
<section>
	{#if errResponse}
		<h1>
			<span class="welcome">
				Error: {urlParams.get('error')}
			</span>
		</h1>
		<h2>{urlParams.get('error_description')}. Click <a href="/">here</a> to try again.</h2>
	{/if}

	{#if successResponse}
		<h1>
			<span class="welcome"> Twitch Response </span>
		</h1>

		{#if message}
			<h2>{message} Please try again. Click <a href="/">here</a> to try again.</h2>
		{:else}
			<h2>
				You will be redirected automatically in {countDown} seconds. If that didn't work click
				<a href="app">here.</a>
			</h2>
		{/if}
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}
</style>
