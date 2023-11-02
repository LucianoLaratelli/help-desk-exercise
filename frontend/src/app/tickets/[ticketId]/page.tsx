"use client";
import { BACKEND_URL } from "@/app/config";
import { DbTicket } from "../../../../types/ticket";
import { TicketStatus } from "../../../../types/ticket-status";
import Layout from "../../components/Layout";
import { FormEvent, useState, useEffect } from "react";

export default function Page({ params }: { params: { ticketId: string } }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [responseError, setResponseError] = useState("");
  const [success, setSuccess] = useState("");
  const [responseSuccess, setResponseSuccess] = useState("");
  const [ticket, setTicket] = useState<DbTicket>({
    name: "",
    email: "",
    description: "",
    id: "",
    status: null as unknown as TicketStatus,
  });

  const [shouldHideButton, setShouldHideButton] = useState(true);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/tickets/${params.ticketId}`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
      });
  }, []);

  async function onChange(event: FormEvent<HTMLSelectElement>) {
    event.preventDefault();
    setStatus(event.currentTarget.value.toString());

    const response = await fetch(`${BACKEND_URL}/tickets/${params.ticketId}`, {
      method: "POST",
      body: JSON.stringify({ status: event.currentTarget.value }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setSuccess("Status update was successful.");
      setError("");
    } else {
      setError(await response.text());
      setSuccess("");
    }
  }

  async function onTextAreaChange(event: FormEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setResponseText(event.currentTarget.value);
    setShouldHideButton(event.currentTarget.value.length == 0);
  }

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(responseText);
    const response = await fetch(
      `${BACKEND_URL}/tickets/${ticket.id}/response`,
      {
        method: "POST",
        body: JSON.stringify({ response: responseText }),
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response.ok) {
      const target = event.target as HTMLFormElement;
      target.reset();
      setResponseSuccess(`Response sent successfully!`);
      setResponseError("");
    } else {
      setResponseError(await response.text());
      setResponseSuccess("");
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
      <form onSubmit={onFormSubmit}>
        <div className="row my-3">
          <div className="col-sm-3 fw-bold">Respond to ticket:</div>
          <div className="col">
            <textarea
              className="form-control"
              onChange={onTextAreaChange}
            ></textarea>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-sm-3 fw-bold"></div>
          <div className="col-sm-auto">
            <button
              type="submit"
              className="btn btn-primary"
              hidden={shouldHideButton}
            >
              Send response
            </button>
          </div>
          <div className="col-sm-auto">
            <p className="text-danger">{responseError}</p>
            <p className="text-success">{responseSuccess}</p>
          </div>
        </div>
      </form>
    </Layout>
  );
}
