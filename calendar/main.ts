import "@std/dotenv/load";
import {
  AnthropicModelProvider,
  runAgentInTerminal,
  ZypherAgent,
} from "@corespeed/zypher";
import { currentTimeTool, timezoneConvertTool } from "./tools/timezone.ts";
import {
  addAppointmentTool,
  deleteAppointmentTool,
  editAppointmentTool,
  getAppointmentTool,
} from "./tools/appointment.ts";

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

const prompt =
  `You are a calendar agent. Your job is to help the user manage their itinerary and daily schedule. The user will ask you to:

1. Set up an appointment
2. Check the time arrangement for a specific appointment
3. Change appointments
`;

const zypher = new ZypherAgent(
  new AnthropicModelProvider({
    apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
  }),
  {
    customInstructions: prompt,
  },
);

// const mcpServerManager = zypher.mcpServerManager;

// mcpServerManager.registerTool(currentTimeTool);
// mcpServerManager.registerTool(getAppointmentTool);
// mcpServerManager.registerTool(addAppointmentTool);
// mcpServerManager.registerTool(editAppointmentTool);
// mcpServerManager.registerTool(deleteAppointmentTool);

// mcpServerManager.registerTool(timezoneConvertTool);

await zypher.init();

await runAgentInTerminal(zypher, "claude-sonnet-4-20250514");
