<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { createQuery } from '@tanstack/svelte-query';
	import { dbUrl } from '$lib/store';
	import type { DependencyRelation, Project } from '$lib/model';
	import DRItem from '$lib/components/DRItem.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import XMark from '$lib/icons/XMark.svelte';

	export let project: Project | null = null;
	export let show: boolean;
	export let onSelect: (relations: DependencyRelation[]) => void;
	export let multiSelect = false;

	let showSelectButton = false;
	let multiSelectMode = false;
	let selectedRelations: DependencyRelation[] = [];
	$: selectedIds = selectedRelations.map((r) => r._id as string);

	function closeModal() {
		show = false;
	}

	function onSelectItem(relation: DependencyRelation, index: number): (e: MouseEvent) => void {
		return (e) => {
			if (multiSelect && multiSelectMode) {
				if (!showSelectButton) showSelectButton = true;

				if (selected(relation)) {
					selectedRelations = [...selectedRelations.filter((r) => r._id !== relation._id)];
				} else if (e.shiftKey) {
					if (!$relationsQuery.data) return;

					const closestIndex = getClosestIndex(index);
					if (closestIndex === -1) return;

					selectedRelations = [
						...selectedRelations,
						...$relationsQuery.data
							.slice(closestIndex, index + 1)
							.filter((r) => !selectedIds.includes(r._id as string))
					];
				} else {
					selectedRelations = [...selectedRelations, relation];
				}
			} else {
				onSelect([relation]);
			}
		};
	}

	function getClosestIndex(index: number): number {
		return selectedRelations.reduce((lastIndex: number, relation) => {
			const relationIndex = $relationsQuery.data?.findIndex((r) => r._id === relation._id);
			if (relationIndex === undefined || relationIndex >= index || relationIndex <= lastIndex) {
				return lastIndex;
			}
			return relationIndex;
		}, -1);
	}

	function onSelectMultipleRelations() {
		onSelect(selectedRelations);
	}

	function selected(relation: DependencyRelation): boolean {
		return selectedRelations.find((r) => r._id === relation._id) !== undefined;
	}

	function cancelSelect() {
		selectedRelations = [];
		showSelectButton = false;
	}

	function toggleMultiSelectionMode() {
		multiSelectMode = !multiSelectMode;
		if (!multiSelectMode) cancelSelect();
	}

	$: relationsQuery = createQuery<DependencyRelation[], Error>({
		queryKey: [$dbUrl, project?._id, 'projects'],
		queryFn: async () => {
			const rawResponse = await fetch(`/api/relations?projectId=${project?._id ?? ''}`, {
				headers: { dbUrl: $dbUrl ?? '' }
			});
			const response = await rawResponse.json();
			if (!rawResponse.ok) throw new Error(response.message);

			return response;
		},
		enabled: Boolean($dbUrl && project)
	});
</script>

{#if show}
	<div
		class="fixed top-0 h-full w-full bg-slate-800/10"
		transition:fade={{ duration: 200 }}
		on:click={closeModal}
		on:keydown|preventDefault
	/>

	<div
		id="modal"
		class="fixed right-0 top-12 flex flex-col gap-2 bg-white p-2"
		transition:slide={{ duration: 200, axis: 'x' }}
	>
		<div class="flex flex-row items-center justify-between">
			<h1 class="text-lg font-bold">Dependency Relations from SC to EL</h1>

			<IconButton icon={XMark} onClick={closeModal} />
		</div>

		{#if multiSelect}
			<div class="flex flex-row justify-between gap-2">
				<div class="flex flex-row items-end gap-1">
					<button
						class="h-6 rounded bg-gray-500 px-2 text-white active:bg-gray-700"
						on:click={toggleMultiSelectionMode}
					>
						Turn {multiSelectMode ? 'off' : 'on'} Multi-selection
					</button>

					{#if multiSelectMode && selectedRelations.length > 0}
						<p class="text-sm">{selectedRelations.length} selected</p>
					{/if}
				</div>

				{#if showSelectButton}
					<div class="flex flex-row gap-2">
						<button
							class="h-6 rounded bg-gray-500 px-2 text-white active:bg-gray-700"
							on:click={cancelSelect}
						>
							Cancel
						</button>
						<button
							class="h-6 rounded bg-blue-500 px-2 text-white active:bg-blue-700"
							on:click={onSelectMultipleRelations}
						>
							Create
						</button>
					</div>
				{:else}
					<div class="h-6" />
				{/if}
			</div>
		{/if}

		<div id="list" class="flex flex-col gap-2 overflow-y-auto">
			{#if $relationsQuery.isSuccess}
				{#if $relationsQuery.data.length === 0}
					<div class="flex h-full flex-col items-center justify-center">
						<h1 class="text-sm text-gray-500">No dependency relations</h1>
					</div>
				{:else}
					{#each $relationsQuery.data as relation, index}
						<DRItem
							{relation}
							onSelect={onSelectItem(relation, index)}
							{selectedRelations}
							{multiSelectMode}
						/>
					{/each}
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	#modal {
		height: calc(100vh - 3rem);
		max-width: calc(100vw - 192px - 256px);
	}
	#list {
		height: calc(100vh - 1rem - 1.75rem - 1.5rem - 0.5rem);
	}
</style>
