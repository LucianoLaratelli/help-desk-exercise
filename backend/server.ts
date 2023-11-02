import express from "express";
import { DbTicket, Ticket } from "./types/ticket";
import { fromZodError } from "zod-validation-error";
import sqlite3 from "sqlite3";
import { TicketStatus } from "./types/ticket-status";

const db = new sqlite3.Database(":memory:");

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tickets/", (req, res) => {
  db.all("SELECT * from tickets", [], function (err: string, rows: any) {
    res.status(200).send(JSON.stringify(rows));
  });
});

const ticketById = (id: string, callback: (err: string, rows: any) => void) => {
  db.get("SELECT * FROM tickets WHERE id = ?", [id], callback);
};

app.get("/tickets/:id", (req, res) => {
  ticketById(req.params.id, function (err: string, row: any) {
    if (err) {
      res.status(500).send(`Database error encountered: ${err}`);
    } else if (row) {
      res.status(200).send(row);
    } else {
      res.status(404).send();
    }
  });
});

app.post("/tickets/:id", (req, res) => {
  if (TicketStatus.safeParse(req.body.status).success) {
    db.run(
      "UPDATE tickets SET status = ? WHERE id = ?",
      [TicketStatus.parse(req.body.status), req.params.id],
      function (err: string, row: any) {
        console.log("guh", err, row);
        if (err) {
          res.status(500).send(`Database error encountered: ${err}`);
        } else {
          console.log("buh");
          res.status(200).send();
        }
      },
    );
  }
});

app.post("/tickets/:id/response", (req, res) => {
  ticketById(req.params.id, function (err: string, row: any) {
    if (err) {
      res.status(500).send(`Database error encountered: ${err}`);
    } else if (row) {
      console.log(
        `would send email to ${row.email} (if it were configured) with contents:`,
      );
      console.log(req.body.response);
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  });
});

app.post("/tickets", (req, res) => {
  const parsed = Ticket.safeParse(req.body);
  console.log(parsed);
  if (!parsed.success) {
    console.log(parsed.error.format());
    res.status(400).send(`invalid ticket: ${fromZodError(parsed.error)}`);
  }

  const ticket = Ticket.parse(req.body);

  db.run(
    "INSERT INTO tickets(id, name, email, description, status) VALUES (?,?,?,?,?)",
    [
      crypto.randomUUID(),
      ticket.name,
      ticket.email,
      ticket.description,
      TicketStatus.Enum.New,
    ],
    function (err: string, row: any) {
      if (err) {
        res.status(500).send(`Failed to save to database: ${err}`);
      }
      res.status(201).send();
    },
  );
});

const init = () => {
  db.run(
    `CREATE TABLE tickets
     (id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('New', 'In Progress', 'Resolved')))`,
  );

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

init();
