import { PrismaClient } from '@prisma/client';

// Đảm bảo rằng chỉ có một thể hiện PrismaClient được tạo trong môi trường phát triển
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Tạo thể hiện PrismaClient với cấu hình ghi log phù hợp
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
