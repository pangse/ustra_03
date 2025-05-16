import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const histories = await prisma.materialHistory.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        material: true,
        handler: true,
      },
    });
    res.status(200).json({ histories });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
} 