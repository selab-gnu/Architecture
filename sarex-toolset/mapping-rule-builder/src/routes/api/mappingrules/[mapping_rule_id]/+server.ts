import { error, json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getCol } from '$lib/server/dbutil';
import type { MappingRule } from '$lib/model';
import { logAndThrowError } from '$lib/server/apiutil';
import type { RequestHandler } from './$types';

export const PUT = (async ({ request, params }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	if (!params.mapping_rule_id) throw error(400, 'Missing _id');

	let newMappingRule: MappingRule;
	try {
		newMappingRule = await request.json();
	} catch (err) {
		throw logAndThrowError('Wrong request body', err, 400);
	}

	try {
		const mappingRulesCol = await getCol<MappingRule>(dbUrl, 'mappingrules');
		await mappingRulesCol.updateOne(
			{ _id: new ObjectId(params.mapping_rule_id) },
			{ $set: newMappingRule }
		);

		return json({ ...newMappingRule, _id: params.mapping_rule_id });
	} catch (err) {
		throw logAndThrowError('Failed to put an existing mapping rule', err);
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ request, params }) => {
	const dbUrl = request.headers.get('dbUrl');
	if (!dbUrl) throw error(400, 'Missing dbUrl header');

	if (!params.mapping_rule_id) throw error(400, 'Missing _id');

	try {
		const mappingRulesCol = await getCol<MappingRule>(dbUrl, 'mappingrules');
		await mappingRulesCol.deleteOne({ _id: new ObjectId(params.mapping_rule_id) });

		return json({ _id: params.mapping_rule_id });
	} catch (err) {
		throw logAndThrowError('Failed to put an existing mapping rule', err);
	}
}) satisfies RequestHandler;
