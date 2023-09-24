<script lang="ts">
	import Plus from '$lib/icons/Plus.svelte';
	import { dbUrl } from '$lib/store';
	import type { MappingRule, Project } from '$lib/model';
	import MappingRuleUpdate from '$lib/components/MappingRuleUpdate.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import MappingRuleNew from '$lib/components/MappingRuleNew.svelte';

	export let project: Project | null = null;
	export let mappingRule: MappingRule | null = null;

	function showNewMappingRuleForm() {
		mappingRule = null;
	}
</script>

<Toolbar>
	<div class="flex w-full flex-row">
		<IconButton onClick={showNewMappingRuleForm} icon={Plus} />
	</div>
</Toolbar>

{#if !$dbUrl || !project}
	<div class="flex h-full flex-col items-center justify-center">
		<h1 class="text-sm text-gray-500">Select a project</h1>
	</div>
{:else if mappingRule !== null}
	<MappingRuleUpdate {project} {mappingRule} {showNewMappingRuleForm} />
{:else}
	<MappingRuleNew {project} />
{/if}
