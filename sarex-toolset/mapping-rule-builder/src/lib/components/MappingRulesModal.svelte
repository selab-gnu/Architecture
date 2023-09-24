<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { MappingRule } from '$lib/model';
	import MappingRuleInModal from '$lib/components/MappingRuleInModal.svelte';

	export let show: boolean;
	export let mappingRules: MappingRule[];
	$: schemaItems = [
		...new Set(
			mappingRules.reduce((items: string[], rule) => {
				items.push(
					...rule.sourceComponentIdentifierSchema,
					...rule.targetComponentIdentifierSchema
				);

				return items;
			}, [])
		)
	];

	type MappingRulesGroup = {
		procedure: string;
		mappingRules: MappingRule[];
	};
	$: groups = mappingRules
		.reduce((groups: MappingRulesGroup[], rule) => {
			const index = groups.findIndex((g) => g.procedure === rule.procedure);
			if (index === -1) groups.push({ procedure: rule.procedure, mappingRules: [rule] });
			else groups[index].mappingRules.push(rule);
			return groups;
		}, [])
		.sort((g1, g2) => (g1.procedure > g2.procedure ? 1 : -1));
</script>

<div
	class="fixed top-0 h-full w-full bg-slate-800/10"
	transition:fade={{ duration: 200 }}
	on:click={() => (show = false)}
	on:keydown|preventDefault
/>

<div
	class="fixed left-1/2 top-1/2 h-4/5 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded bg-white p-2 shadow-md"
	transition:fade={{ duration: 200 }}
>
	<h1 class="mb-4 text-xl font-bold">Summary of Mapping Rules</h1>

	<h2 class="mb-2 text-lg font-bold">{schemaItems.length} Schema Items</h2>
	<section class="flex flex-row gap-2 overflow-x-auto pb-4">
		{#each schemaItems as item}
			<div class="shrink-0 rounded bg-gray-200 px-2 font-mono text-sm">{item}</div>
		{/each}
	</section>

	<h2 class="mb-2 text-lg font-bold">{mappingRules.length} Mapping Rules</h2>
	<section id="mappingrules" class="flex flex-col overflow-y-auto">
		{#each groups as group}
			<div class="border-b border-b-slate-200 py-2">
				<div class="mb-2 font-mono text-sm">{group.procedure}</div>

				<div class="mx-6 flex flex-col">
					{#each group.mappingRules as mappingRule, index}
						<MappingRuleInModal
							{schemaItems}
							{mappingRule}
							isLast={group.mappingRules.length - 1 === index}
						/>
					{/each}
				</div>
			</div>
		{/each}
	</section>
</div>

<style>
	#mappingrules {
		height: calc(
			100vh * 0.8 - 1rem - 1.75rem - 1rem - 1.75rem - 0.5rem - 1.75rem - 0.5rem - 1.25rem - 1rem
		);
	}
</style>
