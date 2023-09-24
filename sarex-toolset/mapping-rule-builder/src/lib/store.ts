import { writable } from 'svelte/store';

export const dbUrl = writable<string | null>(null);
export const dbUrlStorageKey = 'dbUrl';
