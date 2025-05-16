import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const histories = await prisma.materialHistory.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      select: {
        date: true,
      },
    });
    // Group by month
    const monthlyCounts = Array(12).fill(0);
    histories.forEach(h => {
      const month = new Date(h.date).getMonth();
      monthlyCounts[month]++;
    });
    res.status(200).json({ monthlyCounts });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
} 