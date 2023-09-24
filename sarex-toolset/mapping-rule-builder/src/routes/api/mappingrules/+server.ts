import { error, json } from '@sveltejs/kit';
import type { MappingRule } from '$lib/model';
import { convertId, getCol } from '$lib/server/dbutil';
import { logAndThrowError } from '$lib/server/apiutil';
import type { RequestHandler } from './$types';

export const GET = (async ({ request, url }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	const projectId = url.searchParams.get('projectId');
	if (!projectId) throw error(400, 'Missing projectId query parameter');

	try {
		const mappingRulesCol = await getCol<MappingRule>(dbUrl, 'mappingrules');
		const mappingRules = (
			await mappingRulesCol.find({ projectId }).sort({ connectorType: 1 }).toArray()
		).map(convertId);

		return json(mappingRules);
	} catch (err) {
		throw logAndThrowError('Failed to get mapping rules', err);
	}
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	let newMappingRule: MappingRule;
	try {
		newMappingRule = await request.json();
	} catch (err) {
		throw logAndThrowError('Wrong request body', err, 400);
	}

	try {
		const mappingRulesCol = await getCol<MappingRule>(dbUrl, 'mappingrules');
		const result = await mappingRulesCol.insertOne(newMappingRule);

		return json({ ...newMappingRule, _id: result.insertedId.toHexString() });
	} catch (err) {
		throw logAndThrowError('Failed to add a new mapping rule', err);
	}
}) satisfies RequestHandler;
