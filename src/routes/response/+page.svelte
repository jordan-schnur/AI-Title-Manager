<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { onMount } from 'svelte';

	let state = '';
	let urlParams;
	let errResponse = false;
	let successResponse = false;

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

			localStorage.setItem('appCode', urlParams.get('code') ?? '');
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
		<h2>{urlParams.get('error_description')}</h2>
	{/if}

	{#if successResponse}
		<h1>
			<span class="welcome"> Success! </span>
		</h1>
		<h2>{urlParams.get('code')}</h2>
		<h2>{urlParams.get('scope')}</h2>

		<a href="app">Click here to go to app</a>
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
