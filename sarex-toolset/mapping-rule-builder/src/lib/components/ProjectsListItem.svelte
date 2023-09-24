<script lang="ts">
	import classnames from 'classnames';
	import type { Project } from '$lib/model';

	export let project: Project;
	export let selected: boolean = false;
	export let onClick: () => void;
</script>

<button
	class={classnames('flex h-8 w-full flex-row items-center rounded px-2', {
		'bg-slate-200': selected
	})}
	on:click={onClick}
>
	{project.name}
</button>
