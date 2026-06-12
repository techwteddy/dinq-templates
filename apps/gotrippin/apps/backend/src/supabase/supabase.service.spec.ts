import { ForbiddenException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

/**
 * `assertTripEditor` is the gate every write goes through.
 * We exercise it without spinning up a real Supabase connection by
 * spying on `getTripMemberRole` directly on the prototype, so the
 * test never touches the network.
 */
function buildService(): SupabaseService {
  return Object.create(SupabaseService.prototype);
}

describe('SupabaseService.assertTripEditor', () => {
  const tripId = '11111111-1111-1111-1111-111111111111';
  const userId = '22222222-2222-2222-2222-222222222222';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws ForbiddenException when the user is a viewer', async () => {
    const service = buildService();
    jest.spyOn(service, 'getTripMemberRole').mockResolvedValue('viewer');

    await expect(service.assertTripEditor(tripId, userId)).rejects.toBeInstanceOf(ForbiddenException);
  });

  test('throws ForbiddenException when the user is not a member', async () => {
    const service = buildService();
    jest.spyOn(service, 'getTripMemberRole').mockResolvedValue(null);

    await expect(service.assertTripEditor(tripId, userId)).rejects.toBeInstanceOf(ForbiddenException);
  });

  test('resolves quietly when the user is an editor', async () => {
    const service = buildService();
    jest.spyOn(service, 'getTripMemberRole').mockResolvedValue('editor');

    await expect(service.assertTripEditor(tripId, userId)).resolves.toBeUndefined();
  });
});
