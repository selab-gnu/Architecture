<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let onClick: () => void | Promise<void>;
	export let title: string | undefined = undefined;
</script>

<button
	on:click={onClick}
	class="flex h-6 w-6 flex-row items-center justify-center rounded active:bg-slate-200"
>
	<svelte:component this={icon} class="h-5 w-5 shrink-0" />
	{#if title}
		<span>{title}</span>
	{/if}
</button>
