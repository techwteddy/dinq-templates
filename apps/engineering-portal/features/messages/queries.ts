import prisma from '@/lib/prisma';

const pageSize = 10;

export const getMessages = async ({ page }: { page: number }) => {
  const messages = await prisma.messages.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const messagesCount = await prisma.messages.count();

  return { messages, messagesCount };
};
