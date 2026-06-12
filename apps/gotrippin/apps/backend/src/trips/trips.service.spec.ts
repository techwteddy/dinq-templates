import { ConflictException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { ImagesService } from '../images/images.service';
import { TripLocationsService } from '../trip-locations/trip-locations.service';
import { ActivitiesService } from '../activities/activities.service';
import { WeatherService } from '../weather/weather.service';
import { MailService } from '../mail/mail.service';
import { TripsService } from './trips.service';

describe('TripsService.updateTrip — optimistic concurrency', () => {
  const tripId = '11111111-1111-1111-1111-111111111111';
  const userId = '22222222-2222-2222-2222-222222222222';

  const baseTrip = {
    id: tripId,
    title: 'Paris weekend',
    updated_at: '2026-05-25T10:00:00.000Z',
    cover_photo: null,
    created_by: userId,
  };

  function buildSupabaseStub(): SupabaseService {
    const stub: SupabaseService = Object.create(SupabaseService.prototype);
    jest.spyOn(stub, 'getTrip').mockResolvedValue(baseTrip);
    jest.spyOn(stub, 'assertTripEditor').mockResolvedValue(undefined);
    jest.spyOn(stub, 'updateTrip').mockResolvedValue({ ...baseTrip, title: 'Renamed' });
    return stub;
  }

  function buildImagesStub(): ImagesService {
    return Object.create(ImagesService.prototype);
  }

  function buildConfigStub(): ConfigService {
    const stub: ConfigService = Object.create(ConfigService.prototype);
    jest.spyOn(stub, 'get').mockReturnValue('');
    return stub;
  }

  function buildTripLocationsStub(): TripLocationsService {
    return Object.create(TripLocationsService.prototype);
  }

  function buildActivitiesStub(): ActivitiesService {
    return Object.create(ActivitiesService.prototype);
  }

  function buildWeatherStub(): WeatherService {
    return Object.create(WeatherService.prototype);
  }

  function buildMailStub(): MailService {
    return Object.create(MailService.prototype);
  }

  function buildService(): { service: TripsService; supabase: SupabaseService } {
    const supabase = buildSupabaseStub();
    const service = new TripsService(
      supabase,
      buildImagesStub(),
      buildTripLocationsStub(),
      buildActivitiesStub(),
      buildWeatherStub(),
      buildMailStub(),
      buildConfigStub(),
    );
    return { service, supabase };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws ConflictException when expected_updated_at does not match the trip row version', async () => {
    const { service, supabase } = buildService();

    await expect(
      service.updateTrip(tripId, userId, {
        title: 'Renamed',
        expected_updated_at: '2026-05-24T09:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(supabase.assertTripEditor).toHaveBeenCalledWith(tripId, userId);
    expect(supabase.updateTrip).not.toHaveBeenCalled();
  });

  test('writes through when expected_updated_at matches', async () => {
    const { service, supabase } = buildService();

    const result = await service.updateTrip(tripId, userId, {
      title: 'Renamed',
      expected_updated_at: baseTrip.updated_at,
    });

    expect(supabase.updateTrip).toHaveBeenCalledWith(tripId, { title: 'Renamed' });
    expect(result).toEqual({ ...baseTrip, title: 'Renamed' });
  });

  test('propagates editor guard rejection (viewer cannot save trip changes)', async () => {
    const { service, supabase } = buildService();
    jest
      .spyOn(supabase, 'assertTripEditor')
      .mockRejectedValueOnce(new ForbiddenException('Only editors can change this trip'));

    await expect(
      service.updateTrip(tripId, userId, {
        title: 'Renamed',
        expected_updated_at: baseTrip.updated_at,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(supabase.updateTrip).not.toHaveBeenCalled();
  });
});
