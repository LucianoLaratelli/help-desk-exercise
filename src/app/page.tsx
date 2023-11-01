import Layout from "./components/Layout";

export default function Page() {
  return (
    <Layout>
      <div className="my-3">
        <h3>Submit a new ticket </h3>
      </div>
      <form>
        <div className="mb-3">
          <label>Your Name</label>
          <input
            type="name"
            className="form-control"
            id="name-input"
            placeholder="Enter your name"
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
            required
          />
        </div>
        <div className="mb-3">
          <label>Please describe the problem you're experiencing</label>
          <textarea className="form-control" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>{" "}
    </Layout>
  );
}
