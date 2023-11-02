import { z } from "zod";

const TicketStatus = z.enum(["New", "In Progress", "Resolved"]);

type TicketStatus = z.infer<typeof TicketStatus>;

export { TicketStatus };
