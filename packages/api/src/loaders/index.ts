import { Application } from 'express';
import expressLoader from './express';
import LoggerInstance from './logger';

export default async ({ app }: { app: Application }) => {
	await expressLoader({ app });
	LoggerInstance.info('Express loaded');
};
