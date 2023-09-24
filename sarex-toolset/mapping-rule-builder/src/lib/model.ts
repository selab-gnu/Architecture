import type { Document } from 'mongodb';

export type Project = {
	name: string;
	created_at: Date;
} & Document;

export type MappingRule = {
	projectId: string;
	procedure: string;
	connectorType: string;
	sourceComponentIdentifierSchema: string[];
	targetComponentIdentifierSchema: string[];
	relation: DependencyRelation;
} & Document;

export type DependencyRelation = {
	projectId: string;
	source: string;
	target: string;
} & Document;
