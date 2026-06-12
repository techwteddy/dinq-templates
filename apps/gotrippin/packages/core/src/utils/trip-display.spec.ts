import { tripDisplayTitle } from "./trip-display";

describe("tripDisplayTitle", () => {
  test("returns the trimmed title when present", () => {
    expect(tripDisplayTitle({ title: "Paris" })).toBe("Paris");
    expect(tripDisplayTitle({ title: "  Berlin  " })).toBe("Berlin");
  });

  test("falls back to destination when title is missing or blank", () => {
    expect(tripDisplayTitle({ title: "", destination: "Rome" })).toBe("Rome");
    expect(tripDisplayTitle({ title: "   ", destination: "Rome" })).toBe("Rome");
    expect(tripDisplayTitle({ title: null, destination: "Rome" })).toBe("Rome");
    expect(tripDisplayTitle({ destination: "Rome" })).toBe("Rome");
  });

  test("returns null when both title and destination are missing", () => {
    expect(tripDisplayTitle({})).toBeNull();
    expect(tripDisplayTitle({ title: "", destination: "" })).toBeNull();
    expect(tripDisplayTitle({ title: null, destination: null })).toBeNull();
    expect(tripDisplayTitle({ title: "   ", destination: "  " })).toBeNull();
  });
});
