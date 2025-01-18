import { tripName } from "@/data/data";

export default function Header() {
  return (<header className="flex items-center justify-center h-16">
    <h1 className="text-xl font-bold">{tripName}</h1>
  </header>);
}