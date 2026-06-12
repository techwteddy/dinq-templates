import { ConflictException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { TripLocationsService } from './trip-locations.service';

/**
 * Backend optimistic concurrency for stop updates.
 *
 * We build a real `SupabaseService` instance via `Object.create` (skipping the
 * constructor that would require env config) and replace only the methods this
 * test exercises. This avoids `as` casts and keeps the dependency typed.
 */
describe('TripLocationsService.updateLocation — optimistic concurrency', () => {
  const tripId = '11111111-1111-1111-1111-111111111111';
  const locationId = '33333333-3333-3333-3333-333333333333';
  const userId = '22222222-2222-2222-2222-222222222222';

  const baseLocation = {
    id: locationId,
    trip_id: tripId,
    location_name: 'Paris',
    arrival_date: null,
    departure_date: null,
    order_index: 1,
    updated_at: '2026-05-25T10:00:00.000Z',
  };

  function buildSupabaseStub(): SupabaseService {
    const stub: SupabaseService = Object.create(SupabaseService.prototype);
    jest.spyOn(stub, 'assertTripEditor').mockResolvedValue(undefined);
    jest.spyOn(stub, 'isTripMember').mockResolvedValue(true);
    return stub;
  }

  function buildService(): { service: TripLocationsService; supabase: SupabaseService } {
    const supabase = buildSupabaseStub();
    const service = new TripLocationsService(supabase);
    return { service, supabase };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws ConflictException when expected_updated_at does not match the row version', async () => {
    const { service } = buildService();
    jest.spyOn(service, 'getLocation').mockResolvedValue(baseLocation);

    await expect(
      service.updateLocation(locationId, userId, {
        location_name: 'Lyon',
        expected_updated_at: '2026-05-24T09:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  test('does NOT throw when expected_updated_at matches (no-op update keeps the same row)', async () => {
    const { service, supabase } = buildService();
    jest.spyOn(service, 'getLocation').mockResolvedValue(baseLocation);

    const result = await service.updateLocation(locationId, userId, {
      expected_updated_at: baseLocation.updated_at,
    });

    expect(result).toBe(baseLocation);
    expect(supabase.assertTripEditor).toHaveBeenCalledWith(tripId, userId);
  });

  test('propagates editor guard rejection (viewer cannot save stop changes)', async () => {
    const { service, supabase } = buildService();
    jest.spyOn(service, 'getLocation').mockResolvedValue(baseLocation);
    jest
      .spyOn(supabase, 'assertTripEditor')
      .mockRejectedValueOnce(new ForbiddenException('Only editors can change this trip'));

    await expect(
      service.updateLocation(locationId, userId, {
        location_name: 'Lyon',
        expected_updated_at: baseLocation.updated_at,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
