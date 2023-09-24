import { error, json } from '@sveltejs/kit';
import { convertId, getCol } from '$lib/server/dbutil';
import type { DependencyRelation } from '$lib/model';
import type { RequestHandler } from './$types';
import { logAndThrowError } from '$lib/server/apiutil';

export const GET = (async ({ request, url }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	const projectId = url.searchParams.get('projectId');
	if (!projectId) throw error(400, 'Missing projectId query parameter');

	try {
		const drsCol = await getCol<DependencyRelation>(dbUrl, 'drs');
		const drs = (await drsCol.find({ projectId }).sort({ target: 1 }).toArray()).map(convertId);

		return json(drs);
	} catch (err) {
		throw logAndThrowError('Failed to get dependency relations', err);
	}
}) satisfies RequestHandler;
