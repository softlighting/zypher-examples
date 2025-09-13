import { defineTool } from "@corespeed/zypher/tools";
import z from "zod";

// File where appointments are persisted.
const DB_FILE = "./appointments.json";

type Appointment = {
  id: string;
  title: string;
  datetime: string; // ISO 8601 with timezone or offset
  timezone: string; // IANA timezone, e.g. "Asia/Shanghai"
  location?: string;
  description?: string;
};

export async function loadAppointments(): Promise<Appointment[]> {
  try {
    const text = await Deno.readTextFile(DB_FILE);
    return JSON.parse(text);
  } catch (_e) {
    // If file doesn't exist or can't be read, start with empty list.
    return [];
  }
}

export async function saveAppointments(appts: Appointment[]) {
  await Deno.writeTextFile(DB_FILE, JSON.stringify(appts, null, 2));
}

// ----------------- ADD APPOINTMENT TOOL -----------------

export const addAppointmentTool = defineTool({
  name: "appointment_add",
  description: "Create a new appointment.",
  parameters: z.object({
    title: z.string().describe("Appointment title"),
    datetime: z
      .string()
      .describe("ISO 8601 datetime string (with or without timezone)"),
    timezone: z.string().describe("IANA timezone for the datetime"),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
  execute: async ({ title, datetime, timezone, location, description }) => {
    const appointments = await loadAppointments();
    const id = crypto.randomUUID();
    const newAppt: Appointment = {
      id,
      title,
      datetime,
      timezone,
      location,
      description,
    };
    appointments.push(newAppt);
    await saveAppointments(appointments);
    return JSON.stringify(newAppt);
  },
});

// ----------------- GET APPOINTMENT TOOL -----------------

export const getAppointmentTool = defineTool({
  name: "appointment_get",
  description:
    "Retrieve appointment(s). Provide an `id` to get a single appointment or omit to list all.",
  parameters: z.object({
    id: z.string().describe("Unique appointment ID").optional(),
  }),
  execute: async ({ id }) => {
    const appointments = await loadAppointments();
    if (id) {
      const appt = appointments.find((a) => a.id === id);
      if (!appt) {
        throw new Error(`Appointment with id ${id} not found.`);
      }
      return JSON.stringify(appt);
    }
    return JSON.stringify(appointments);
  },
});

// ----------------- EDIT APPOINTMENT TOOL -----------------

export const editAppointmentTool = defineTool({
  name: "appointment_edit",
  description: "Edit fields of an existing appointment by `id`.",
  parameters: z.object({
    id: z.string().describe("Unique appointment ID"),
    title: z.string().describe("New title").optional(),
    datetime: z
      .string()
      .describe("New ISO 8601 datetime (with or without timezone)")
      .optional(),
    timezone: z
      .string()
      .describe("IANA timezone for the new datetime")
      .optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
  execute: async (params) => {
    const { id, ...updates } = params;
    const appointments = await loadAppointments();
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new Error(`Appointment with id ${id} not found.`);
    }
    appointments[idx] = { ...appointments[idx], ...updates };
    await saveAppointments(appointments);
    return JSON.stringify(appointments[idx]);
  },
});

// ----------------- DELETE APPOINTMENT TOOL -----------------

export const deleteAppointmentTool = defineTool({
  name: "appointment_delete",
  description: "Delete an appointment by `id`.",
  parameters: z.object({
    id: z.string().describe("Unique appointment ID"),
  }),
  execute: async ({ id }) => {
    const appointments = await loadAppointments();
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new Error(`Appointment with id ${id} not found.`);
    }
    const [removed] = appointments.splice(idx, 1);
    await saveAppointments(appointments);
    return JSON.stringify(removed);
  },
});
