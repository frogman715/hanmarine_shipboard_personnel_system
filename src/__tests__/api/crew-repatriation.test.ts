/**
 * Integration tests for crew endpoints
 * Direct tests without node-mocks-http
 */
import { POST as repatriationHandler } from '@/app/api/crew/[id]/repatriation/route';
import prisma from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    crew: {
      findUnique: jest.fn(),
    },
    repatriation: {
      create: jest.fn(),
    },
  },
}));

describe('Crew API Routes - Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/crew/[id]/repatriation', () => {
    it('should reject request with non-numeric crew id', async () => {
      const req = new Request('http://localhost:3000/api/crew/abc/repatriation', {
        method: 'POST',
        body: JSON.stringify({ reason: 'End of contract' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await repatriationHandler(req, { params: { id: 'abc' } });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Invalid crew id');
    });

    it('should reject request with missing crew', async () => {
      (prisma.crew.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const req = new Request('http://localhost:3000/api/crew/999/repatriation', {
        method: 'POST',
        body: JSON.stringify({ reason: 'End of contract' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await repatriationHandler(req, { params: { id: '999' } });
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toContain('Crew not found');
    });

    it('should create repatriation record on valid request', async () => {
      (prisma.crew.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });
      (prisma.repatriation.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        crewId: 1,
        repatriationDate: new Date('2025-11-15'),
        reason: 'End of contract',
        finalAccount: 5000.0,
        processedBy: 'Admin',
        remarks: 'OK',
      });

      const req = new Request('http://localhost:3000/api/crew/1/repatriation', {
        method: 'POST',
        body: JSON.stringify({
          reason: 'End of contract',
          finalAccount: 5000,
          processedBy: 'Admin',
          remarks: 'OK',
          repatriationDate: '2025-11-15',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await repatriationHandler(req, { params: { id: '1' } });
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.crewId).toBe(1);
      expect(data.reason).toBe('End of contract');
    });

    it('should reject invalid finalAccount', async () => {
      (prisma.crew.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });

      const req = new Request('http://localhost:3000/api/crew/1/repatriation', {
        method: 'POST',
        body: JSON.stringify({ finalAccount: 'not-a-number' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await repatriationHandler(req, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('finalAccount must be a number');
    });

    it('should reject invalid date format', async () => {
      (prisma.crew.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });

      const req = new Request('http://localhost:3000/api/crew/1/repatriation', {
        method: 'POST',
        body: JSON.stringify({ repatriationDate: 'invalid-date' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await repatriationHandler(req, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Invalid repatriationDate');
    });
  });
});
