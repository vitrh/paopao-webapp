import express from 'express';
import ws from 'ws';
import config from './config';
import { schema } from './graphql';
import { subscribe } from 'graphql';
import logger from './loaders/logger';

async function startServer() {
	const app = express();
	await require('./loaders').default({ app });

	app
		.listen(config.port, () => {
			// const wsServer = new ws.Server({
			// 	server,
			// 	path: config.api.graphqlPrefix,
			// });

			// useServer(
			// 	{
			// 		context: async ({ extra }, _message, _args) => ({
			// 			pubsub: pubsub,
			// 			session: await connectSession({ req: extra.request }),
			// 			req: extra.request,
			// 			user: await connectSession({ req: extra.request }).then(
			// 				(session) => session?.user,
			// 			),
			// 		}),
			// 		schema,
			// 		subscribe,
			// 	},
			// 	wsServer,
			// );

			logger.info(`Server listening on port: ${config.port}`);
		})
		.on('error', (err) => {
			logger.error(err);
			process.exit(1);
		});
}

startServer();
