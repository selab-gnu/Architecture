<script lang="ts">
	export let error: Error | undefined = undefined;
</script>

<p class="text-xs text-red-500">Error: {error ? error.message : 'unknown error'}</p>
