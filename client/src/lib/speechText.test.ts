import { describe, expect, test } from "vitest";
import { appendTranscript } from "./speechText";

describe("appendTranscript", () => {
  test("uses the transcript when the field is empty", () => {
    expect(appendTranscript("", "Fix the drain near school")).toBe("Fix the drain near school");
  });

  test("appends transcript to existing field text with spacing", () => {
    expect(appendTranscript("Please repair the bus stop.", "It floods when raining.")).toBe(
      "Please repair the bus stop. It floods when raining.",
    );
  });

  test("ignores blank transcript text", () => {
    expect(appendTranscript("Existing text", "   ")).toBe("Existing text");
  });
});
