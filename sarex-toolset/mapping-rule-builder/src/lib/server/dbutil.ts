import { MongoClient, type Collection, type WithId, type Document } from 'mongodb';

export async function getCol<T extends Document>(
	dbUrl: string,
	col: string
): Promise<Collection<T>> {
	const client = new MongoClient(dbUrl, {});
	await client.connect();

	return client.db().collection<T>(col);
}

export function convertId<T>(item: WithId<T>): Omit<T, '_id'> & { _id: string } {
	return { ...item, _id: item._id.toString() };
}
