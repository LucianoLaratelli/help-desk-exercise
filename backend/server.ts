import express from "express";
import { DbTicket, Ticket } from "./types/ticket";
import { fromZodError } from "zod-validation-error";
import sqlite3 from "sqlite3";
import { TicketStatus } from "./types/ticket-status";
import cors from "cors";

const db = new sqlite3.Database(":memory:");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/tickets/", (req, res) => {
  db.all(
    `SELECT * from tickets
     ORDER BY
         CASE status
             WHEN "New" THEN 0
             WHEN "In Progress" THEN 1
             WHEN "Resolved" THEN 2
         END`,
    [],
    function (err: string, rows: any) {
      if (err) {
        console.log(err);
        res.status(500).send(`Database error encountered: ${err}`);
      } else if (rows) {
        res.status(200).send(JSON.stringify(rows));
      } else {
        res.status(404).send();
      }
    },
  );
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
        if (err) {
          res.status(500).send(`Database error encountered: ${err}`);
        } else {
          res.status(200).send();
        }
      },
    );
  }
});

app.post("/tickets/:id/response", (req, res) => {
  if (req.body.response.length == 0) {
    res.status(500).send("Can't send empty email.");
  } else {
    ticketById(req.params.id, function (err: string, row: any) {
      if (err) {
        res.status(500).send(`Database error encountered: ${err}`);
      } else if (row) {
        console.log(
          "Would normally send email here with body:",
          req.body.response,
        );
        res.status(200).send();
      } else {
        res.status(404).send();
      }
    });
  }
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
