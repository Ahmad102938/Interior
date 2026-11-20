import { permanentRedirect } from "next/navigation";

/** Team & leadership now live on the About page (organisation section). */
export default function TeamPage() {
  permanentRedirect("/about#people");
}
