import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

export const timezoneConvertTool = defineTool({
  name: "timezone_convert",
  description: `Convert a timestamp from one timezone to another.
• \`time\` can be any ISO-8601–compatible string. If it does **not** contain an explicit timezone or offset, the local runtime timezone will be assumed.
• \`output_timezone\` is optional; if omitted, the local runtime timezone will be used.

Examples:
• "2024-03-25T15:30:00Z" (UTC specified)
• "2024-03-25T15:30:00" (interpreted as local timezone)
• "2024-03-25 15:30" (interpreted as local timezone)`,
  parameters: z.object({
    time: z.string().describe(
      "ISO 8601 timestamp. If timezone/offset omitted, local timezone is assumed, e.g. 2024-03-25T15:30:00Z",
    ),
    output_timezone: z.string().describe(
      "IANA timezone name for the desired output, e.g. Europe/London",
    ).optional(),
  }),
  execute: ({ time, output_timezone }) => {
    // Parse date string. If the string lacks timezone information, Date() treats it as local.
    // If parsing fails (Invalid Date), throw an error to aid debugging.
    const inputDate = new Date(time);
    if (isNaN(inputDate.valueOf())) {
      throw new Error(
        "Invalid date format provided to timezone_convert tool. Must be ISO 8601 format, e.g. 2024-03-25T15:30:00Z",
      );
    }
    const tz = output_timezone ??
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    // The Intl API automatically accounts for Daylight Saving Time when formatting.
    return Promise.resolve(inputDate.toLocaleString("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }));
  },
});

// ----------------- CURRENT TIME TOOL -----------------

export const currentTimeTool = defineTool({
  name: "current_time",
  description:
    "Return the current timestamp and the runtime's local timezone. No parameters required.",
  parameters: z.object({}),
  execute: () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    return Promise.resolve(JSON.stringify({
      iso: now.toISOString(),
      timezone: tz,
      localized: now.toLocaleString("en-US", {
        timeZone: tz,
        timeZoneName: "short",
      }),
    }));
  },
});
