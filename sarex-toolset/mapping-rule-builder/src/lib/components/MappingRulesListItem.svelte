<script lang="ts">
	import classnames from 'classnames';
	import type { MappingRule } from '$lib/model';

	export let mappingRule: MappingRule;
	export let selected: boolean = false;
	export let onClick: () => void;

	$: source =
		mappingRule.sourceComponentIdentifierSchema?.length > 0
			? `<${mappingRule.sourceComponentIdentifierSchema.join(', ')}>`
			: 'no schema';

	$: target =
		mappingRule.targetComponentIdentifierSchema?.length > 0
			? `<${mappingRule.targetComponentIdentifierSchema.join(', ')}>`
			: 'no schema';
</script>

<button
	class={classnames('w-full rounded px-2', {
		'bg-slate-200': selected
	})}
	on:click={onClick}
>
	<div
		class={classnames('flex h-full min-h-[2rem] flex-col items-start justify-center rounded py-2', {
			'border-b border-b-slate-200': !selected
		})}
	>
		<div class="mb-2 w-52 break-all text-left font-bold leading-tight">
			{mappingRule.procedure}
		</div>

		<div class="font-mono text-xs">
			source: {source}
		</div>

		<div class="font-mono text-xs">
			target: {target}
		</div>
	</div>
</button>
