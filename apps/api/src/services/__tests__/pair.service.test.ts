import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPairService } from '../pair.service.js';

const mockPrisma = {
  pair: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn((args: unknown[]) => Promise.all(args)),
};

describe('PairService', () => {
  let service: ReturnType<typeof createPairService>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = createPairService(mockPrisma as never);
  });

  describe('list', () => {
    it('returns paginated pairs with meta', async () => {
      const pairs = [{ id: '1', discipline: 'MD', isActive: true }];
      mockPrisma.pair.findMany.mockResolvedValue(pairs);
      mockPrisma.pair.count.mockResolvedValue(1);

      const result = await service.list({});
      expect(result.data).toEqual(pairs);
      expect(result.meta.total).toBe(1);
    });

    it('filters by athleteId using OR clause', async () => {
      mockPrisma.pair.findMany.mockResolvedValue([]);
      mockPrisma.pair.count.mockResolvedValue(0);

      await service.list({ athleteId: 'a1' });

      expect(mockPrisma.pair.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ athleteAId: 'a1' }, { athleteBId: 'a1' }],
          }),
        }),
      );
    });
  });

  describe('create', () => {
    it('normalises athlete order (a < b) to prevent duplicate inverse pairs', async () => {
      const created = { id: 'p1', discipline: 'MD', athleteAId: 'a1', athleteBId: 'b1' };
      mockPrisma.pair.create.mockResolvedValue(created);

      // Pass IDs in reverse — service must swap them
      await service.create({ discipline: 'MD', athleteAId: 'b1', athleteBId: 'a1' });

      expect(mockPrisma.pair.create).toHaveBeenCalledWith({
        data: { discipline: 'MD', athleteAId: 'a1', athleteBId: 'b1' },
      });
    });

    it('keeps original order when athleteAId < athleteBId', async () => {
      mockPrisma.pair.create.mockResolvedValue({});

      await service.create({ discipline: 'XD', athleteAId: 'a1', athleteBId: 'z9' });

      expect(mockPrisma.pair.create).toHaveBeenCalledWith({
        data: { discipline: 'XD', athleteAId: 'a1', athleteBId: 'z9' },
      });
    });
  });

  describe('softDelete', () => {
    it('sets deletedAt on the pair', async () => {
      mockPrisma.pair.update.mockResolvedValue({ id: 'p1', deletedAt: new Date() });

      await service.softDelete('p1');

      expect(mockPrisma.pair.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      });
    });
  });
});
