<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { onMount } from 'svelte';

	let clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
	let redirectUri = import.meta.env.VITE_TWITCH_AUTH_REDIRECT;

	const scope = ['channel', 'manage', 'broadcast'];

	let urlScope = encodeURIComponent(scope.join(':'));

	let state = '';
	let urlParams;
	let errResponse = false;

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
			console.log('Has err');
			errResponse = true;
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
	<h1>
		<span class="welcome"> Twitch Title Manager </span>
	</h1>

	<a
		target="_blank"
		href="https://id.twitch.tv/oauth2/authorize?
	response_type=code&
	client_id={clientId}&
	redirect_uri={redirectUri}&
	scope={urlScope}&
	state={state}">Connect with Twitch</a
	>
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

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
