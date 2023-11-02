import { z } from "zod";
import { TicketStatus } from "./ticket-status";

const DbTicket = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  description: z.string().min(1),
  status: TicketStatus,
});

type DbTicket = z.infer<typeof DbTicket>;

const Ticket = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  description: z.string().min(1),
});

type Ticket = z.infer<typeof Ticket>;

export { DbTicket, Ticket };
