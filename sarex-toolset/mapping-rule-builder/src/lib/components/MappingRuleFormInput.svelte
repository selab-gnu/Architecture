<script lang="ts">
	export let id: string;
	export let value: string;
	export let placeholder: string;

	export let onClick: (() => void) | undefined = undefined;
	export let onKeyDown: ((e: KeyboardEvent) => void) | undefined = undefined;
	export let disabled = false;
</script>

<input
	{id}
	type="text"
	bind:value
	class="h-8 rounded border border-slate-100 px-2 outline-none"
	{placeholder}
	on:click={onClick}
	on:keydown={onKeyDown}
	{disabled}
/>
