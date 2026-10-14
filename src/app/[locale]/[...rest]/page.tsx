import { notFound } from "next/navigation";

// Unknown paths under a valid locale render the localized not-found page
// instead of the language-neutral global 404.
export default function CatchAllPage() {
  notFound();
}
