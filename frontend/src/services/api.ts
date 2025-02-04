import axios from 'axios';
import type { Transaction } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3333/api'
});

export const transactionService = {
  async getAll() {
    const { data } = await api.get<Transaction[]>('/transactions');
    return data;
  },

  async create(transaction: Omit<Transaction, 'id' | 'date'>) {
    const { data } = await api.post<Transaction>('/transactions', transaction);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/transactions/${id}`);
  },

  async update(id: string, transaction: Partial<Transaction>) {
    const { data } = await api.put<Transaction>(`/transactions/${id}`, transaction);
    return data;
  }
}; 