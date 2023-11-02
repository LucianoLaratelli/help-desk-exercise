import { z } from "zod";
declare const DbTicket: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<["New", "In Progress", "Resolved"]>;
}, "strip", z.ZodTypeAny, {
    status: "New" | "In Progress" | "Resolved";
    id: string;
    name: string;
    email: string;
    description: string;
}, {
    status: "New" | "In Progress" | "Resolved";
    id: string;
    name: string;
    email: string;
    description: string;
}>;
type DbTicket = z.infer<typeof DbTicket>;
declare const Ticket: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    description: string;
}, {
    name: string;
    email: string;
    description: string;
}>;
type Ticket = z.infer<typeof Ticket>;
export { DbTicket, Ticket };
