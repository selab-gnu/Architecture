<script lang="ts">
	import Toolbar from '$lib/components/Toolbar.svelte';
</script>

<Toolbar>
	<slot name="toolbar" />
</Toolbar>

<div id="sidebar" class="overflow-y-auto bg-white p-2">
	<slot />
</div>

<style>
	#sidebar {
		/* padding top/bottom 1rem, Toolbar 3rem */
		height: calc(100vh - 4rem);
	}
</style>
