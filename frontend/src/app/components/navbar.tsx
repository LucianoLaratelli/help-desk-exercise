import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Help Desk
        </Link>
        <div className="navbar-nav">
          <Link href="/admin-panel" className="nav-item nav-link">
            Admin panel
          </Link>
        </div>
      </div>
    </nav>
  );
}
