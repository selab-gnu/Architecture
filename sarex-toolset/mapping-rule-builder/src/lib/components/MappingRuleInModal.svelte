<script lang="ts">
	import classnames from 'classnames';
	import type { MappingRule } from '$lib/model';

	export let schemaItems: string[];
	export let mappingRule: MappingRule;
	export let isLast: boolean;

	let sourceCidSchema = mappingRule.sourceComponentIdentifierSchema.join(', ');
	let targetCidShcmea = mappingRule.targetComponentIdentifierSchema.join(', ');
	let addSourceCidSchema = schemaItems
		.filter(
			(i) =>
				!mappingRule.sourceComponentIdentifierSchema.includes(i) &&
				!mappingRule.targetComponentIdentifierSchema.includes(i)
		)
		.join(', ');
</script>

<div class={classnames({ 'border-b border-b-slate-200': !isLast }, isLast ? 'pt-2' : 'py-2')}>
	<div class="flex flex-row gap-2">
		<div class="w-40 text-right text-xs font-bold">Mapping Rule ID</div>
		<div class="font-mono text-xs">{mappingRule._id}</div>
	</div>
	<div class="flex flex-row gap-2">
		<div class="w-40 text-right text-xs font-bold">Connector Type</div>
		<div class="font-mono text-xs">{mappingRule.connectorType}</div>
	</div>
	<div class="flex flex-row gap-2">
		<div class="w-40 text-right text-xs font-bold">External Library</div>
		<div class="font-mono text-xs">{mappingRule.relation.target}</div>
	</div>
	<div class="flex flex-row gap-2">
		<div class="w-40 text-right text-xs font-bold">Source CId Schema</div>
		<div class="font-mono text-xs">{sourceCidSchema}</div>
	</div>
	<div class="flex flex-row gap-2">
		<div class="w-40 text-right text-xs font-bold">Add. Source CId Schema</div>
		<div class="font-mono text-xs">{addSourceCidSchema}</div>
	</div>
	<div class="flex flex-row gap-2">
		<div class="w-40 text-right text-xs font-bold">Target CId Schema</div>
		<div class="font-mono text-xs">{targetCidShcmea}</div>
	</div>
</div>
