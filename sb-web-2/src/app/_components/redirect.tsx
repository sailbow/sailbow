import { redirect } from "@/lib/router-compat";

export default function Redirect({ href }: { href: string }) {
  return redirect(href);
}
