"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticket_1 = require("./types/ticket");
const zod_validation_error_1 = require("zod-validation-error");
const sqlite3_1 = __importDefault(require("sqlite3"));
const ticket_status_1 = require("./types/ticket-status");
const db = new sqlite3_1.default.Database(":memory:");
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/tickets/", (req, res) => {
    db.all("SELECT * from tickets", [], function (err, rows) {
        res.status(200).send(JSON.stringify(rows));
    });
});
app.get("/tickets/:id", (req, res) => {
    db.get("SELECT * FROM tickets WHERE id = ?", [req.params.id], function (err, row) {
        if (err) {
            res.status(500).send(`Database error encountered: ${err}`);
        }
        else if (row) {
            res.status(200).send(row);
        }
        else {
            res.status(404).send();
        }
    });
});
app.post("/tickets/:id", (req, res) => {
    console.log(req.body);
    console.log(ticket_status_1.TicketStatus.safeParse(req.body.status));
    if (ticket_status_1.TicketStatus.safeParse(req.body.status).success) {
        db.run("UPDATE tickets SET status = ? WHERE id = ?", [ticket_status_1.TicketStatus.parse(req.body.status), req.params.id], function (err, row) {
            console.log("guh", err, row);
            if (err) {
                res.status(500).send(`Database error encountered: ${err}`);
            }
            else {
                console.log("buh");
                res.status(200).send();
            }
        });
    }
});
app.post("/tickets", (req, res) => {
    const parsed = ticket_1.Ticket.safeParse(req.body);
    console.log(parsed);
    if (!parsed.success) {
        console.log(parsed.error.format());
        res.status(400).send(`invalid ticket: ${(0, zod_validation_error_1.fromZodError)(parsed.error)}`);
    }
    const ticket = ticket_1.Ticket.parse(req.body);
    db.run("INSERT INTO tickets(id, name, email, description, status) VALUES (?,?,?,?,?)", [
        crypto.randomUUID(),
        ticket.name,
        ticket.email,
        ticket.description,
        ticket_status_1.TicketStatus.Enum.New,
    ], function (err, row) {
        if (err) {
            res.status(500).send(`Failed to save to database: ${err}`);
        }
        res.status(201).send();
    });
});
const init = () => {
    db.run(`CREATE TABLE tickets
     (id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('New', 'In Progress', 'Resolved')))`);
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};
init();
