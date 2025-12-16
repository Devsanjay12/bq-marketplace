import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const gen = await prisma.zImageGeneration.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        console.log(JSON.stringify(gen, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
