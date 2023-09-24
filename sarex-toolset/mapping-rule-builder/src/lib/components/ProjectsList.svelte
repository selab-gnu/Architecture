<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { dbUrl, dbUrlStorageKey } from '$lib/store';
	import type { Project } from '$lib/model';
	import CircleStack from '$lib/icons/CircleStack.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ProjectsListItem from '$lib/components/ProjectsListItem.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import Error from '$lib/components/Error.svelte';
	import MappingRulesList from '$lib/components/MappingRulesList.svelte';

	let selectedProject: Project | null = null;

	$: projectsQuery = createQuery<Project[], Error>({
		queryKey: [$dbUrl, 'projects'],
		queryFn: async () => {
			const rawResponse = await fetch('/api/projects', { headers: { dbUrl: $dbUrl ?? '' } });
			const response = await rawResponse.json();
			if (!rawResponse.ok) throw new Error(response.message);

			return response;
		},
		enabled: Boolean($dbUrl)
	});

	function openDBConfig() {
		const url = prompt('Type DB url', $dbUrl ?? '');
		if (url) {
			dbUrl.set(url);
			localStorage.setItem(dbUrlStorageKey, url);
		}
	}
</script>

<div class="flex w-48 flex-col border-r border-r-slate-900/10">
	<Sidebar>
		<div slot="toolbar" class="flex w-full flex-row items-center justify-between px-2">
			<h1 class="text-sm font-bold">Projects</h1>
			<IconButton onClick={openDBConfig} icon={CircleStack} />
		</div>

		<div>
			{#if $projectsQuery.isLoading}
				<Loading />
			{:else if $projectsQuery.isError}
				<svelte:component this={Error} error={$projectsQuery.error.message} />
			{:else if $projectsQuery.isSuccess}
				{#each $projectsQuery.data as project}
					<ProjectsListItem
						{project}
						selected={selectedProject?._id === project._id}
						onClick={() => (selectedProject = project)}
					/>
				{/each}
			{/if}
		</div>
	</Sidebar>
</div>

<MappingRulesList bind:project={selectedProject} />
