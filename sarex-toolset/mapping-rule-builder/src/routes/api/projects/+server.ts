import { error, json } from '@sveltejs/kit';
import { convertId, getCol } from '$lib/server/dbutil';
import type { Project } from '$lib/model';
import type { RequestHandler } from './$types';
import { logAndThrowError } from '$lib/server/apiutil';

export const GET = (async ({ request }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	try {
		const projectsCol = await getCol<Project>(dbUrl, 'projects');
		const projects = (await projectsCol.find({}).sort({ created_at: -1 }).toArray()).map(convertId);

		return json(projects);
	} catch (err) {
		throw logAndThrowError('Failed to get projects', err);
	}
}) satisfies RequestHandler;
