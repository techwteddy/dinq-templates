import { ConflictException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ActivitiesService } from './activities.service';

describe('ActivitiesService.updateActivity — optimistic concurrency', () => {
  const tripId = '11111111-1111-1111-1111-111111111111';
  const activityId = '44444444-4444-4444-4444-444444444444';
  const userId = '22222222-2222-2222-2222-222222222222';

  const baseActivity = {
    id: activityId,
    trip_id: tripId,
    title: 'Louvre tour',
    type: 'attraction',
    location_id: null,
    start_time: null,
    end_time: null,
    all_day: false,
    updated_at: '2026-05-25T10:00:00.000Z',
  };

  function buildSupabaseStub(): SupabaseService {
    const stub: SupabaseService = Object.create(SupabaseService.prototype);
    jest.spyOn(stub, 'assertTripEditor').mockResolvedValue(undefined);
    jest.spyOn(stub, 'isTripMember').mockResolvedValue(true);
    return stub;
  }

  function buildService(): { service: ActivitiesService; supabase: SupabaseService } {
    const supabase = buildSupabaseStub();
    const service = new ActivitiesService(supabase);
    return { service, supabase };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws ConflictException when expected_updated_at does not match the row version', async () => {
    const { service } = buildService();
    jest.spyOn(service, 'getActivity').mockResolvedValue(baseActivity);

    await expect(
      service.updateActivity(activityId, userId, {
        title: 'Updated',
        expected_updated_at: '2026-05-24T09:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  test('does NOT throw when expected_updated_at matches and no fields actually change', async () => {
    const { service, supabase } = buildService();
    jest.spyOn(service, 'getActivity').mockResolvedValue(baseActivity);

    const result = await service.updateActivity(activityId, userId, {
      expected_updated_at: baseActivity.updated_at,
    });

    expect(result).toBe(baseActivity);
    expect(supabase.assertTripEditor).toHaveBeenCalledWith(tripId, userId);
  });

  test('propagates editor guard rejection (viewer cannot save activity changes)', async () => {
    const { service, supabase } = buildService();
    jest.spyOn(service, 'getActivity').mockResolvedValue(baseActivity);
    jest
      .spyOn(supabase, 'assertTripEditor')
      .mockRejectedValueOnce(new ForbiddenException('Only editors can change this trip'));

    await expect(
      service.updateActivity(activityId, userId, {
        title: 'Updated',
        expected_updated_at: baseActivity.updated_at,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
