import { type Route } from "next";
import { redirect } from "next/navigation";

export default function Redirect({ href }: { href: Route }) {
  return redirect(href);
}
