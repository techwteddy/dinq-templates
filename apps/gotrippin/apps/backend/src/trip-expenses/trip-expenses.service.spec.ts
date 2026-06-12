import { ConflictException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { TripExpensesService } from './trip-expenses.service';

describe('TripExpensesService.updateExpense — optimistic concurrency', () => {
  const tripId = '11111111-1111-1111-1111-111111111111';
  const expenseId = '55555555-5555-5555-5555-555555555555';
  const userId = '22222222-2222-2222-2222-222222222222';

  const baseExpense = {
    id: expenseId,
    trip_id: tripId,
    amount_minor: 400,
    currency_code: 'EUR',
    title: 'Coffee',
    spent_at: '2026-05-25T10:00:00.000Z',
    created_by: userId,
    updated_at: '2026-05-25T10:00:00.000Z',
  };

  function buildSupabaseStub(): SupabaseService {
    const stub: SupabaseService = Object.create(SupabaseService.prototype);
    jest.spyOn(stub, 'assertTripEditor').mockResolvedValue(undefined);
    jest.spyOn(stub, 'isTripMember').mockResolvedValue(true);
    return stub;
  }

  function buildService(): { service: TripExpensesService; supabase: SupabaseService } {
    const supabase = buildSupabaseStub();
    const service = new TripExpensesService(supabase);
    return { service, supabase };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws ConflictException when expected_updated_at does not match the row version', async () => {
    const { service } = buildService();
    jest.spyOn(service, 'getExpense').mockResolvedValue(baseExpense);

    await expect(
      service.updateExpense(tripId, expenseId, userId, {
        amount_minor: 300,
        expected_updated_at: '2026-05-24T09:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  test('does NOT throw when expected_updated_at matches and no fields actually change', async () => {
    const { service, supabase } = buildService();
    jest.spyOn(service, 'getExpense').mockResolvedValue(baseExpense);

    const result = await service.updateExpense(tripId, expenseId, userId, {
      expected_updated_at: baseExpense.updated_at,
    });

    expect(result).toBe(baseExpense);
    expect(supabase.assertTripEditor).toHaveBeenCalledWith(tripId, userId);
  });

  test('propagates editor guard rejection (viewer cannot save expense changes)', async () => {
    const { service, supabase } = buildService();
    jest.spyOn(service, 'getExpense').mockResolvedValue(baseExpense);
    jest
      .spyOn(supabase, 'assertTripEditor')
      .mockRejectedValueOnce(new ForbiddenException('Only editors can change this trip'));

    await expect(
      service.updateExpense(tripId, expenseId, userId, {
        amount_minor: 300,
        expected_updated_at: baseExpense.updated_at,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
