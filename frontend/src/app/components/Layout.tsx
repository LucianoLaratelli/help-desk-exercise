import NavBar from "./navbar";
import React from "react";

// https://stackoverflow.com/a/67377965/5692730
// to resolve a `#0 12.34 Type error: Binding element 'children' implicitly has an 'any' type.`
type MyComponentProps = React.PropsWithChildren<{}>;

export default function Layout({ children }: MyComponentProps) {
  return (
    <div>
      <NavBar />
      <div className="container">{children}</div>
    </div>
  );
}
