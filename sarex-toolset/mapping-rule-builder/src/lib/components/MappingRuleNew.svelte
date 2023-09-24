<script lang="ts">
	import { getContext } from 'svelte';
	import type { DependencyRelation, MappingRule, Project } from '$lib/model';
	import MappingRuleForm from '$lib/components/MappingRuleForm.svelte';
	import SchemaElement from '$lib/components/SchemaElement.svelte';
	import MappingRuleFormInput from '$lib/components/MappingRuleFormInput.svelte';
	import DRListModal from '$lib/components/DRListModal.svelte';
	import DRItem from '$lib/components/DRItem.svelte';
	import { dbUrl } from '$lib/store';

	export let project: Project;

	let refetchMappingRules = getContext<() => Promise<void>>('refetchMappingRules');
	let selectMappingRule = getContext<(mappingRule: MappingRule) => void>('selectMappingRule');

	let relations: DependencyRelation[] = [];
	let showProcedureModal = false;

	function selectRelations(r: DependencyRelation[]) {
		relations = r;
		showProcedureModal = false;
	}

	let connectorType: string = '';

	let newSourceSchemaElement: string = '';
	let sourceSchema: string[] = [];

	function addSourceSchemaElement(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			if (!sourceSchema.includes(newSourceSchemaElement)) {
				sourceSchema = [...sourceSchema, newSourceSchemaElement];
			}

			newSourceSchemaElement = '';
		}
	}

	function removeSourceSchemaElement(index: number) {
		sourceSchema.splice(index, 1);
		sourceSchema = [...sourceSchema];
	}

	let newTargetSchemaElement: string = '';
	let targetSchema: string[] = [];

	function addTargetSchemaElement(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			if (!targetSchema.includes(newTargetSchemaElement)) {
				targetSchema = [...targetSchema, newTargetSchemaElement];
			}

			newTargetSchemaElement = '';
		}
	}

	function removeTargetSchemaElement(index: number) {
		targetSchema.splice(index, 1);
		targetSchema = [...targetSchema];
	}

	async function createMappingRule() {
		let lastMappingRule: MappingRule | null = null;
		for (const relation of relations) {
			const rawResponse = await fetch('/api/mappingrules', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					dbUrl: $dbUrl ?? ''
				},
				body: JSON.stringify({
					projectId: project?._id ?? '',
					procedure: relation.source ?? '',
					relation,
					connectorType,
					sourceComponentIdentifierSchema: sourceSchema,
					targetComponentIdentifierSchema: targetSchema
				})
			});

			const response = (await rawResponse.json()) as MappingRule;
			if (!rawResponse.ok) throw new Error(response.message);
			lastMappingRule = response;
		}

		await refetchMappingRules();
		if (lastMappingRule) selectMappingRule(lastMappingRule);
		alert(
			`${
				relations.length === 1 ? 'A mapping rule has' : `${relations.length} mapping rules have`
			} been created successfully!`
		);
	}

	function resetFields() {
		relations = [];
		connectorType = '';
		sourceSchema = [];
		targetSchema = [];
	}
</script>

<div class="flex flex-col gap-6 p-2">
	<MappingRuleForm id="procedure-input" label="Procedure">
		<MappingRuleFormInput
			id="procedure-input"
			value={relations.length > 0 ? relations[0].source : ''}
			placeholder="Select a procedure"
			onClick={() => (showProcedureModal = true)}
			disabled={showProcedureModal}
		/>
		{#if relations.length > 0}
			{#each relations as relation}
				<DRItem {relation} />
			{/each}
		{/if}
	</MappingRuleForm>

	<MappingRuleForm id="connector-type" label="Connector Type">
		<MappingRuleFormInput
			id="connector-type"
			bind:value={connectorType}
			placeholder="Type a connector type"
		/>
	</MappingRuleForm>

	<MappingRuleForm id="source-comp" label="Source Component Identifier Schema">
		<MappingRuleFormInput
			id="source-comp"
			bind:value={newSourceSchemaElement}
			placeholder="Type a new element for the schema"
			onKeyDown={addSourceSchemaElement}
		/>

		<div class="flex flex-row flex-wrap">
			{#each sourceSchema as element, index}
				<SchemaElement {element} remove={() => removeSourceSchemaElement(index)} />
			{/each}
		</div>
	</MappingRuleForm>

	<MappingRuleForm id="target-comp" label="Target Component Identifier Schema">
		<MappingRuleFormInput
			id="target-comp"
			bind:value={newTargetSchemaElement}
			placeholder="Type a new element for the schema"
			onKeyDown={addTargetSchemaElement}
		/>

		<div class="flex flex-row flex-wrap">
			{#each targetSchema as element, index}
				<SchemaElement {element} remove={() => removeTargetSchemaElement(index)} />
			{/each}
		</div>
	</MappingRuleForm>

	<div class="flex w-full flex-row justify-between">
		<button
			class="h-6 rounded bg-blue-500 px-2 text-white active:bg-blue-700"
			on:click={createMappingRule}>Create</button
		>
		<button
			class="h-6 rounded bg-gray-500 px-2 text-white active:bg-gray-700"
			on:click={resetFields}>Cancel</button
		>
	</div>
</div>

<DRListModal
	bind:project
	bind:show={showProcedureModal}
	onSelect={selectRelations}
	multiSelect={true}
/>
