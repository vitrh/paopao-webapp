import { db } from '../../utils/prisma';
import { builder } from '../builder';

builder.prismaObject('User', {
	findUnique: (user) => ({ id: user.id }),
	fields: (t) => ({
		id: t.exposeID('id'),
		name: t.exposeString('name'),
		password: t.exposeString('password'),
	}),
});

// example user query

builder.queryField('getUser', (t) =>
	t.prismaField({
		type: 'User',
		args: {
			id: t.arg.id(),
		},
		authScopes: {
			public: true,
		},
		skipTypeScopes: true,
		resolve: async (query, _root, { id }, _ctx) => {
			return await db.user.findUnique({
				...query,
				where: { id: id },
				rejectOnNotFound: true,
			});
		},
	}),
);
