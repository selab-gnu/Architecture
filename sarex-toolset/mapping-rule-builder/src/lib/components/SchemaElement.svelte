<script lang="ts">
	export let element: string;
	export let remove: () => void;
</script>

<div class="mr-2 rounded text-xs">
	{element}<button class="cursor-pointer hover:underline" on:click={remove}>(x)</button>
</div>
