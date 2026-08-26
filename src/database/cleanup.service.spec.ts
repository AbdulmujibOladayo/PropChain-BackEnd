import { CleanupService, getLastCleanupSummary } from './cleanup.service';
import { PrismaService } from './prisma.service';

describe('CleanupService', () => {
  let service: CleanupService;
  let prisma: jest.Mocked<Partial<PrismaService>>;

  beforeEach(() => {
    prisma = {
      blacklistedToken: { deleteMany: jest.fn().mockResolvedValue({ count: 3 }) } as any,
      passwordResetToken: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) } as any,
      session: { deleteMany: jest.fn().mockResolvedValue({ count: 5 }) } as any,
      loginHistory: { deleteMany: jest.fn().mockResolvedValue({ count: 10 }) } as any,
    };
    service = new CleanupService(prisma as unknown as PrismaService);
  });

  it('performCleanup returns summary with correct totalDeleted', async () => {
    const summary = await service.performCleanup();
    expect(summary.totalDeleted).toBe(19);
    expect(summary.results).toHaveLength(4);
    expect(summary.ranAt).toBeDefined();
  });

  it('getLastSummary returns null before any run', () => {
    expect(service.getLastSummary()).toBeNull();
  });

  it('getLastCleanupSummary (module-level) returns null initially', () => {
    expect(getLastCleanupSummary()).toBeNull();
  });

  it('performCleanup calls deleteMany on all four entities', async () => {
    await service.performCleanup();
    expect(prisma.blacklistedToken.deleteMany).toHaveBeenCalled();
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalled();
    expect(prisma.session.deleteMany).toHaveBeenCalled();
    expect(prisma.loginHistory.deleteMany).toHaveBeenCalled();
  });
});