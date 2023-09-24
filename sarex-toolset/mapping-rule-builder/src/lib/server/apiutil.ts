import { error, type HttpError } from '@sveltejs/kit';

export function logAndThrowError(msg: string, err: unknown, status?: number): HttpError {
	console.error(err);
	return error(status ?? 500, `${msg}: ${err instanceof Error ? err.message : err}`);
}
