<script lang="ts">
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { Styles } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { Button, Modal } from 'sveltestrap';
	import axios from 'axios';

	let isOpen = false;
	const toggle = () => (isOpen = !isOpen);

	$: channelInfo = { title: '' };
	$: tags = channelInfo.tags ?? [];

	onMount(async () => {
		channelInfo = await axios.post('/api/channel').then((response) => response.data);
		console.log(channelInfo);
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Twitch Title Manager" />
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
	/>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
	/>
</svelte:head>
<section>
	<h1>
		<span class="welcome"> Twitch Title Manager </span>
	</h1>

	<div class="container-sm"></div>

	<div class="parent">
		<div class="div1">
			<label for="streamTitle" class="form-label">Stream Title</label>
			<input
				type="text"
				class="form-control"
				bind:value={channelInfo.title}
				id="streamTitle"
				aria-describedby="streamHelp"
			/>
		</div>
		<div class="div2">
			<h3>{channelInfo.game_name}</h3>
		</div>
		<div class="div3">
			{#each tags as tag}
				<span class="badge rounded-pill text-bg-primary aitm-pill">#{tag}</span>
			{/each}
		</div>
	</div>
</section>

<style>
	.aitm-pill {
		margin: 8px 8px 0px 0px;
		cursor: pointer;
		user-select: none; /* Prevents text selection */
	}

	.aitm-pill:hover {
		background-color: RGBA(13, 110, 253, 0.8) !important;
	}

	.parent {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}

	.div1 {
		grid-area: 1 / 1 / 2 / 6;
	}
	.div2 {
		grid-area: 2 / 1 / 3 / 4;
	}
	.div3 {
		grid-area: 5 / 1 / 6 / 6;
	}
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
