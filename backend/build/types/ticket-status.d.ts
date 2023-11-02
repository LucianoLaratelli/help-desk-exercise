import { z } from "zod";
declare const TicketStatus: z.ZodEnum<["New", "In Progress", "Resolved"]>;
type TicketStatus = z.infer<typeof TicketStatus>;
export { TicketStatus };
