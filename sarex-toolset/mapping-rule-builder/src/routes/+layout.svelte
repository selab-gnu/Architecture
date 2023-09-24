<script lang="ts">
	import { onMount } from 'svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { dbUrl, dbUrlStorageKey } from '$lib/store';
	import '../app.css';

	const queryClient = new QueryClient();

	onMount(() => {
		if (browser) {
			const url = localStorage.getItem(dbUrlStorageKey);
			if (url) dbUrl.set(url);
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
