<script lang="ts">
	import classnames from 'classnames';
	import { fade } from 'svelte/transition';
	import type { DependencyRelation } from '$lib/model';
	import CheckCircle from '$lib/icons/CheckCircle.svelte';
	import CheckCircleSolid from '$lib/icons/CheckCircleSolid.svelte';

	export let relation: DependencyRelation;
	export let onSelect: ((e: MouseEvent) => void) | undefined = undefined;
	export let selectedRelations: DependencyRelation[] = [];
	export let multiSelectMode = false;
	$: selected = selectedRelations.find((r) => r._id === relation._id) !== undefined;
</script>

<button
	class={classnames(
		'flex w-full flex-row items-center gap-2 rounded border border-slate-200 p-2 shadow active:bg-slate-100',
		{ 'bg-slate-100': selected }
	)}
	on:click={onSelect}
>
	{#if multiSelectMode}
		<div transition:fade>
			{#if selected}
				<CheckCircleSolid class="h-6 w-6" />
			{:else}
				<CheckCircle class="h-6 w-6" />
			{/if}
		</div>
	{/if}

	<div class="flex w-full flex-col">
		<div class="flex flex-row items-center gap-1">
			<div
				class="flex h-4 shrink-0 flex-row items-center rounded bg-blue-500 px-2 font-mono text-xs text-white"
			>
				EL
			</div>

			<h1 class="break-all text-left font-mono text-sm font-bold">
				{relation.target}
			</h1>
		</div>

		<div class="flex flex-row items-center gap-1">
			<div
				class="flex h-4 shrink-0 flex-row items-center rounded bg-gray-500 px-2 font-mono text-xs text-white"
			>
				SC
			</div>

			<p class="break-all text-left font-mono text-xs">{relation.source}</p>
		</div>
	</div>
</button>
