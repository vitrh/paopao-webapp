import { PrismaClient } from '.prisma/client';
import { users } from './users';

const prisma = new PrismaClient();

async function main() {
	// seeding testusers

	for (const user in users) {
		if (!(await prisma.user.findFirst({ where: { name: users[user].name } }))) {
		}
	}
}
