"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketStatus = void 0;
const zod_1 = require("zod");
const TicketStatus = zod_1.z.enum(["New", "In Progress", "Resolved"]);
exports.TicketStatus = TicketStatus;
