import SchemaBuilder from '@giraphql/core';
import ErrorsPlugin from '@giraphql/plugin-errors';
import SimpleObjectsPlugin from '@giraphql/plugin-simple-objects';
import ScopeAuthPlugin from '@giraphql/plugin-scope-auth';
import ValidationPlugin from '@giraphql/plugin-validation';
import PrismaPlugin from '@giraphql/plugin-prisma';
import SmartSubscriptionsPlugin, {
	subscribeOptionsFromIterator,
} from '@giraphql/plugin-smart-subscriptions';
import PrismaTypes from '@giraphql/plugin-prisma/generated';

import { IncomingMessage, OutgoingMessage } from 'http';
import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';

export interface Context {
	req: IncomingMessage;
	res: OutgoingMessage;
	// pubsub: 'pubsub';
	user?: 'Vinh';
	// session?: Session | null;
}

export function createGraphQLContext(
	req: IncomingMessage,
	res: OutgoingMessage,
	// pubsub: 'pubsub',
	// session?: (Session & { user: 'Vinh' }) | null,
): Context {
	return {
		req,
		res,
		// pubsub,
		user: 'Vinh',
		// session,
	};
}

const prisma = new PrismaClient({});

export const builder = new SchemaBuilder<{
	PrismaTypes: PrismaTypes;
	// We change the defaults for arguments to be `required`. Any non-required
	// argument can be set to `required: false`.
	DefaultInputFieldRequiredness: true;
	Context: Context;
	Scalars: {
		// We modify the types for the `ID` type to denote that it's always a string when it comes in.
		ID: { Input: string; Output: string | number };
		DateTime: { Input: Date; Output: Date };
	};
	// Define the shape of the auth scopes that we'll be using:
	AuthScopes: {
		public: boolean;
		user: boolean;
		unauthenticated: boolean;
	};
	SmartSubscription: {
		debounceDelay: number | null;
		subscribe: (
			name: string,
			context: Context,
			cb: (err: unknown, data?: unknown) => void,
		) => Promise<void> | void;
		unsubscribe: (name: string, context: Context) => Promise<void> | void;
	};
}>({
	defaultInputFieldRequiredness: true,
	plugins: [
		ErrorsPlugin,
		SimpleObjectsPlugin,
		ScopeAuthPlugin,
		ValidationPlugin,
		SmartSubscriptionsPlugin,
		PrismaPlugin,
	],
	authScopes: async ({ user }) => ({
		public: true,
		user: !!user,
		unauthenticated: !user,
	}),
	smartSubscriptions: {
		...subscribeOptionsFromIterator((name, { pubsub }) => {
			return pubsub.asyncIterator(name);
		}),
	},
	errorOptions: {
		defaultTypes: [Error, ZodError],
	},
	prisma: { client: prisma },
});

builder.queryType({
	authScopes: {
		user: true,
	},
});
builder.mutationType({
	authScopes: {
		user: true,
	},
});
builder.subscriptionType({
	authScopes: {
		user: true,
	},
});

// Provide the custom DateTime scalar that allows dates to be transmitted over GraphQL:
builder.scalarType('DateTime', {
	serialize: (date) => date.toISOString(),
	parseValue: (date) => {
		return new Date(date);
	},
});
