import { getPrisma } from './connection';

const deleteFailedJob = async (id: number): Promise<void> => {
    const prisma = getPrisma();
    await prisma.failedJob.delete({
        where: { id },
    });
};
export default deleteFailedJob;
