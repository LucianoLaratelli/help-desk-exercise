"use client";
import { DbTicket, Ticket } from "../../../../../backend/types/ticket";
import { TicketStatus } from "../../../../../backend/types/ticket-status";
import Layout from "../../components/Layout";
import { FormEvent, useState, useRef, useEffect } from "react";

export default function Page({ params }: { params: { ticketId: string } }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ticket, setTicket] = useState<DbTicket>({
    name: "",
    email: "",
    description: "",
    id: "",
    status: null as unknown as TicketStatus,
  });

  useEffect(() => {
    fetch(`http://localhost:3001/tickets/${params.ticketId}`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
      });
  }, []);

  async function onChange(event: FormEvent<HTMLSelectElement>) {
    event.preventDefault();
    setStatus(event.currentTarget.value.toString());

    const response = await fetch(
      `http://localhost:3001/tickets/${params.ticketId}`,
      {
        method: "POST",
        body: JSON.stringify({ status: event.currentTarget.value }),
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      setSuccess("Status update was successful.");
      setError("");
    } else {
      setError(await response.text());
      setSuccess("");
    }
  }

  // FIXME: couldn't get the `select` to use the `TicketStatus` enum. There was
  // a `module parse error`. I think because of trying to use something from zod
  // on the frontend? I dug in a little bit but opted to move forward.
  return (
    <Layout>
      <h2>{ticket.id}</h2>
      <div className="row">
        <div className="col-sm-3 fw-bold">Name</div>
        <div className="col">{ticket.name}</div>
      </div>
      <div className="row">
        <div className="col-sm-3 fw-bold">Email</div>
        <div className="col">{ticket.email}</div>
      </div>
      <div className="row">
        <div className="col-sm-3 fw-bold">Status</div>
        <div className="col">{status}</div>
      </div>
      <div className="row">
        <div className="col-sm-3 fw-bold">Description</div>
        <div className="col">
          <p className="text-wrap">{ticket.description}</p>
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-sm-3 fw-bold">Change status:</div>
        <div className="col-sm-auto">
          <select
            className="form-select"
            aria-label="select a new status"
            value={status}
            onChange={onChange}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="col-sm-auto">
          <p className="text-danger">{error}</p>
          <p className="text-success">{success}</p>
        </div>
      </div>
    </Layout>
  );
}
