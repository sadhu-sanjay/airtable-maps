import Counter from "~/app/components/Counter";
import PlaceHolderMap from "./components/PlaceHolderMap";
import Home from "~/app/components/map-component";

export default function App() {
  // return <Dropdown />
  return (
    <main className="flex bg-slate-100 dark:bg-slate-900 h-auto flex-col w-full min-h-[100dvh] justify-between">
      <Home />
    </main>
  );
}
