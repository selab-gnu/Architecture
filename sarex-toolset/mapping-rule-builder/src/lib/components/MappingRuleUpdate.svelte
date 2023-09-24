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
	export let mappingRule: MappingRule;
	export let showNewMappingRuleForm: () => void;
	let mappingRuleId: string;

	let refetchMappingRules = getContext<() => Promise<void>>('refetchMappingRules');

	let relation: DependencyRelation | undefined = undefined;
	let showProcedureModal = false;

	function selectRelation(r: DependencyRelation[]) {
		relation = r[0];
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

	async function updateMappingRule() {
		if (!checkIfChanged()) return;

		const rawResponse = await fetch(`/api/mappingrules/${mappingRule?._id ?? ''}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				dbUrl: $dbUrl ?? ''
			},
			body: JSON.stringify({
				projectId: project?._id ?? '',
				procedure: relation?.source ?? '',
				relation,
				connectorType,
				sourceComponentIdentifierSchema: sourceSchema,
				targetComponentIdentifierSchema: targetSchema
			})
		});

		const response = await rawResponse.json();
		if (!rawResponse.ok) throw new Error(response.message);

		mappingRule = response;
		await refetchMappingRules();
		alert('A mapping rule has been updated successfully!');
	}

	function checkIfChanged() {
		if (!mappingRule) return true;

		if (mappingRule.relation._id !== relation?._id) return true;
		if (mappingRule.connectorType !== connectorType) return true;
		if (mappingRule.sourceComponentIdentifierSchema !== sourceSchema) return true;
		if (mappingRule.targetComponentIdentifierSchema !== targetSchema) return true;

		return false;
	}

	async function deleteMappingRule() {
		let confirmed = confirm('Are you sure you want to delete this mapping rule?');
		if (!confirmed) return;

		const rawResponse = await fetch(`/api/mappingrules/${mappingRule?._id ?? ''}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				dbUrl: $dbUrl ?? ''
			}
		});

		const response = await rawResponse.json();
		if (!rawResponse.ok) throw new Error(response.message);

		showNewMappingRuleForm();
		await refetchMappingRules();
	}

	$: {
		if (mappingRule && mappingRuleId !== mappingRule._id) {
			mappingRuleId = mappingRule._id;
			relation = mappingRule.relation;
			connectorType = mappingRule.connectorType;
			sourceSchema = mappingRule.sourceComponentIdentifierSchema;
			targetSchema = mappingRule.targetComponentIdentifierSchema;
		}
	}
</script>

<div class="flex flex-col gap-6 p-2">
	<MappingRuleForm id="procedure-input" label="Procedure">
		<MappingRuleFormInput
			id="procedure-input"
			value={relation?.source ?? ''}
			placeholder="Select a procedure"
			onClick={() => (showProcedureModal = true)}
			disabled={showProcedureModal}
		/>
		{#if relation}
			<DRItem {relation} />
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
			on:click={updateMappingRule}
		>
			Update
		</button>
		<button class="h-6 rounded px-2 text-red-500 active:text-red-700" on:click={deleteMappingRule}>
			Delete
		</button>
	</div>
</div>

<DRListModal bind:project bind:show={showProcedureModal} onSelect={selectRelation} />
