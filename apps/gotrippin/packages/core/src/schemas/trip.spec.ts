import {
  CreateTripSchema,
  TripUpdateDataSchema,
  TripCreateDataSchema,
  UpdateTripLocationSchema,
  UpdateActivitySchema,
  UpdateTripExpenseSchema,
} from "./trip";

describe("CreateTripSchema / TripCreateDataSchema date validation", () => {
  test("rejects when end_date is before start_date", () => {
    const result = TripCreateDataSchema.safeParse({
      title: "Trip",
      start_date: "2026-06-10T00:00:00.000Z",
      end_date: "2026-06-01T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  test("accepts when start_date and end_date are equal", () => {
    const result = TripCreateDataSchema.safeParse({
      title: "Trip",
      start_date: "2026-06-01T00:00:00.000Z",
      end_date: "2026-06-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  test("CreateTripSchema accepts trip without dates", () => {
    const result = CreateTripSchema.safeParse({ title: "Trip" });
    expect(result.success).toBe(true);
  });
});

describe("TripUpdateDataSchema optimistic-locking field", () => {
  test("accepts an ISO datetime in expected_updated_at", () => {
    const result = TripUpdateDataSchema.safeParse({
      title: "Renamed",
      expected_updated_at: "2026-05-25T10:30:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  test("accepts Postgres offset timestamps and normalizes to Z", () => {
    const result = TripUpdateDataSchema.safeParse({
      title: "Renamed",
      expected_updated_at: "2026-05-25T10:30:00+00:00",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.expected_updated_at).toBe("2026-05-25T10:30:00.000Z");
    }
  });

  test("rejects a malformed expected_updated_at", () => {
    const result = TripUpdateDataSchema.safeParse({
      title: "Renamed",
      expected_updated_at: "not-a-timestamp",
    });
    expect(result.success).toBe(false);
  });

  test("rejects sending both cover_photo and cover_upload_storage_key", () => {
    const result = TripUpdateDataSchema.safeParse({
      cover_upload_storage_key: "trip-images/uploads/u/123",
      cover_photo: {
        unsplash_photo_id: "abc",
        download_location: "https://api.unsplash.com/photos/abc/download",
        image_url: "https://images.unsplash.com/photo-abc",
        photographer_name: "Jane Doe",
        photographer_url: "https://unsplash.com/@jane",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateTripLocationSchema optimistic locking", () => {
  test("expected_updated_at is optional and accepts ISO datetime", () => {
    expect(UpdateTripLocationSchema.safeParse({}).success).toBe(true);
    expect(
      UpdateTripLocationSchema.safeParse({
        location_name: "Paris",
        expected_updated_at: "2026-05-25T10:30:00.000Z",
      }).success,
    ).toBe(true);
  });

  test("rejects malformed expected_updated_at", () => {
    const result = UpdateTripLocationSchema.safeParse({
      location_name: "Paris",
      expected_updated_at: "yesterday",
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateActivitySchema optimistic locking", () => {
  test("expected_updated_at is optional and accepts ISO datetime", () => {
    expect(
      UpdateActivitySchema.safeParse({
        title: "Museum",
        expected_updated_at: "2026-05-25T10:30:00.000Z",
      }).success,
    ).toBe(true);
  });

  test("rejects malformed expected_updated_at", () => {
    const result = UpdateActivitySchema.safeParse({
      title: "Museum",
      expected_updated_at: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateTripExpenseSchema optimistic locking", () => {
  test("expected_updated_at is optional and accepts ISO datetime", () => {
    expect(
      UpdateTripExpenseSchema.safeParse({
        amount_minor: 500,
        expected_updated_at: "2026-05-25T10:30:00.000Z",
      }).success,
    ).toBe(true);
  });

  test("rejects malformed expected_updated_at", () => {
    const result = UpdateTripExpenseSchema.safeParse({
      amount_minor: 500,
      expected_updated_at: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});
