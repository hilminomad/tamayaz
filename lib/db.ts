// this file is responsible for allowing us to access database using prisma

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

 // looks for globalThis.prisma if we don't have it creates a new PrismaClient
export const db = globalThis.prisma || new PrismaClient();

// checks if we are in production to avoid crashes
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
