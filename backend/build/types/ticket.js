"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = exports.DbTicket = void 0;
const zod_1 = require("zod");
const ticket_status_1 = require("./ticket-status");
const DbTicket = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    description: zod_1.z.string().min(1),
    status: ticket_status_1.TicketStatus,
});
exports.DbTicket = DbTicket;
const Ticket = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    description: zod_1.z.string().min(1),
});
exports.Ticket = Ticket;
