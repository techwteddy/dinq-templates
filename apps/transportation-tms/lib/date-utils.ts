import { format } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";

// GMT+8 timezone (Asia/Manila, Asia/Singapore, etc.)
export const TIMEZONE = "Asia/Manila";

/**
 * Convert a UTC date string to GMT+8 zoned time
 */
export function toGMT8(date: Date | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return toZonedTime(dateObj, TIMEZONE);
}

/**
 * Convert a GMT+8 zoned time to UTC
 */
export function fromGMT8(date: Date): Date {
  return fromZonedTime(date, TIMEZONE);
}

/**
 * Format a date in GMT+8 timezone
 */
export function formatGMT8(
  date: Date | string,
  formatStr: string
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(dateObj, TIMEZONE, formatStr);
}

/**
 * Get current date/time in GMT+8
 */
export function nowGMT8(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Create a date from local GMT+8 values and convert to UTC for storage
 */
export function createGMT8Date(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): Date {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  return fromZonedTime(new Date(dateStr), TIMEZONE);
}

/**
 * Format a UTC date string to datetime-local format (YYYY-MM-DDTHH:mm) in GMT+8
 * This is used for datetime-local input fields
 */
export function formatToDatetimeLocal(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const gmt8Date = toGMT8(dateObj);
  const year = gmt8Date.getFullYear();
  const month = String(gmt8Date.getMonth() + 1).padStart(2, "0");
  const day = String(gmt8Date.getDate()).padStart(2, "0");
  const hours = String(gmt8Date.getHours()).padStart(2, "0");
  const minutes = String(gmt8Date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert a datetime-local string (interpreted as GMT+8) to UTC ISO string
 * This is used when receiving datetime-local values from forms
 * 
 * datetime-local format: "YYYY-MM-DDTHH:mm" (no timezone info)
 * We need to treat this as GMT+8 and convert to UTC
 */
export function datetimeLocalToUTC(datetimeLocal: string): string {
  // Parse the datetime-local string (format: "YYYY-MM-DDTHH:mm")
  // We need to treat this as GMT+8 time
  const [datePart, timePart] = datetimeLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Create a date string in ISO format, but we'll treat it as GMT+8
  // We need to manually construct a date that represents this time in GMT+8
  // Then convert it to UTC
  
  // Create a date object representing this time in GMT+8
  // We do this by creating a date string with timezone offset
  const gmt8DateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+08:00`;
  
  // Parse as GMT+8 and convert to UTC
  const date = new Date(gmt8DateString);
  return date.toISOString();
}

