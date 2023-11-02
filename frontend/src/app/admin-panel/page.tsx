import Layout from "../components/Layout";
import Link from "next/link";
import { DbTicket } from "../../../types/ticket";
import { TicketStatus } from "../../../types/ticket-status";
import { BACKEND_URL } from "../config";

async function getData() {
  const res = await fetch(`${BACKEND_URL}/tickets`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const tickets = res.json();

  for (const ticket in tickets) {
    DbTicket.parse(ticket);
  }

  return tickets;
}

function TicketStatusBadge(status: TicketStatus) {
  switch (status) {
    case TicketStatus.enum.New:
      return <span className="badge text-bg-danger mb-3">{status}</span>;
    case TicketStatus.enum["In Progress"]:
      return <span className="badge text-bg-warning mb-3">{status}</span>;
    case TicketStatus.enum.Resolved:
      return <span className="badge text-bg-success mb-3">{status}</span>;
  }
}

function TicketCard(ticket: DbTicket) {
  return (
    <div className="card" key={ticket.id}>
      <div className="card-body">
        <h5 className="card-title">
          <Link href={`tickets/${ticket.id}`} className="stretched-link hidden">
            {ticket.id}
          </Link>
        </h5>
        {TicketStatusBadge(ticket.status)}
        <h6 className="card-subtitle text-body-secondary mb-2">
          {ticket.name} (<a href={`mailto:${ticket.email}`}>{ticket.email}</a>)
        </h6>
      </div>
    </div>
  );
}

export default async function Page() {
  const tickets = await getData();

  return (
    <Layout>
      <div className="mb-3">
        <h3>Admin panel</h3>
      </div>
      {tickets.map((ticket: DbTicket) => TicketCard(ticket))}
    </Layout>
  );
}
