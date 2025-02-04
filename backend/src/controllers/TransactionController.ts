import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class TransactionController {
  async index(req: Request, res: Response) {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    });
    
    return res.json(transactions);
  }

  async create(req: Request, res: Response) {
    const { amount, description, type, category, installments } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(amount),
        description,
        type,
        category,
        installments: installments || undefined
      }
    });

    return res.status(201).json(transaction);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id }
    });

    return res.status(204).send();
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, description, type, category, installments } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: amount ? Number(amount) : undefined,
        description,
        type,
        category,
        installments: installments || undefined
      }
    });

    return res.json(transaction);
  }
} 