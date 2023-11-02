"use client";
import Layout from "./components/Layout";
import { FormEvent, useState } from "react";
import { Ticket } from "../../../backend/types/ticket";

const createUrl = "http://localhost:3001/tickets";

export default function Page() {
  const [formData, setFormData] = useState<Ticket>({
    name: "",
    email: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateName = (name: string) => {
    setFormData((previousState: Ticket) => {
      return {
        ...previousState,
        name,
      };
    });
  };

  const updateEmail = (email: string) => {
    setFormData((previousState: Ticket) => {
      return {
        ...previousState,
        email,
      };
    });
  };

  const updateDescription = (description: string) => {
    setFormData((previousState: Ticket) => {
      return {
        ...previousState,
        description,
      };
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(createUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const target = event.target as HTMLFormElement;
      target.reset();
      setSuccess(`Ticket created succesfully. Thanks, ${formData.name}!`);
      setError("");
    } else {
      setError(await response.text());
      setSuccess("");
    }
  }

  return (
    <Layout>
      <div className="mb-3">
        <h3>Submit a new ticket </h3>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>Your Name</label>
          <input
            type="name"
            className="form-control"
            id="name-input"
            placeholder="Enter your name"
            onChange={(e) => updateName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            id="email-input"
            placeholder="Enter email"
            onChange={(e) => updateEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Please describe the problem you're experiencing</label>
          <textarea
            className="form-control"
            onChange={(e) => updateDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </Layout>
  );
}
