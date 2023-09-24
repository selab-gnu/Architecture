<script lang="ts">
	export let label: string;
	export let id: string;
</script>

<div class="flex flex-col gap-2">
	<label for={id} class="text-sm font-bold">{label}</label>
	<slot />
</div>
