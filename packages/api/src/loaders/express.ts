import express, { Application } from 'express';
import cors from 'cors';
import {
	shouldRenderGraphiQL,
	renderGraphiQL,
	processRequest,
	getGraphQLParameters,
} from 'graphql-helix';
import { schema } from '../graphql';
import { Context, createGraphQLContext } from '../graphql/builder';
import config from '../config';

const whiteList = ['http://vinhfullstack.localhost', 'http://localhost:3000'];

const expressLoader = async ({ app }: { app: Application }) => {
	app.use(cors({ origin: whiteList, credentials: true }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	// app.use(ironSession(sessionOption));

	app.use(config.api.graphqlPrefix, async (req, res) => {
		const request = {
			body: req.body,
			headers: req.headers,
			method: req.method,
			query: req.query,
		};

		// const session = await connectSession({ req, res });

		try {
			if (shouldRenderGraphiQL(request)) {
				res.send(
					renderGraphiQL({
						endpoint: config.api.graphqlPrefix,
						subscriptionsEndpoint: config.api.graphqlPrefix,
					}),
				);
			} else {
				// Extract the GraphQL parameters from the request
				const { operationName, query, variables } =
					getGraphQLParameters(request);

				// Validate
				const result = await processRequest<Context>({
					operationName,
					query,
					variables,
					request,
					schema,
					contextFactory: () => createGraphQLContext(req, res),
				});

				if (result.type === 'RESPONSE') {
					result.headers.forEach(({ name, value }) =>
						res.setHeader(name, value),
					);
					res.status(result.status);
					res.json(result.payload);
				} else if (result.type === 'MULTIPART_RESPONSE') {
					res.writeHead(200, {
						Connection: 'keep-alive',
						'Content-Type': 'multipart/mixed; boundary="-"',
						'Transfer-Encoding': 'chunked',
					});

					req.on('close', () => {
						result.unsubscribe();
					});

					res.write('---');

					await result.subscribe((result) => {
						const chunk = Buffer.from(JSON.stringify(result), 'utf-8');
						const data = [
							'',
							'Content-Type: application/json; charset=utf-8',
							'Content-Length: ' + String(chunk.length),
							'',
							chunk,
						];

						if (result.hasNext) {
							data.push('---');
						}

						res.write(data.join('\r\n'));
					});

					res.write('\r\n-----\r\n');
					res.end();
				} else {
					// Indicate we're sending an event stream to the client
					res.writeHead(200, {
						'Content-Type': 'text/event-stream',
						Connection: 'keep-alive',
						'Cache-Control': 'no-cache',
					});

					// If the request is closed by the client, we unsubscribe and stop executing the request
					req.on('close', () => {
						result.unsubscribe();
					});

					// We subscribe to the event stream and push any new events to the client
					await result.subscribe((result) => {
						res.write(`data: ${JSON.stringify(result)}\n\n`);
					});
				}
			}
		} catch (error) {
			res.status(500);
			res.end(error);
		}
	});
};
export default expressLoader;
