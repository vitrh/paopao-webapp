import { User } from '.prisma/client';
import { IncomingMessage } from 'http';

export async function createSession(req: IncomingMessage, user: User) {}
