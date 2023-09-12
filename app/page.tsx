import Counter from "~/app/components/Counter";
import PlaceHolderMap from "./components/PlaceHolderMap";
import { MapComponent } from "~/app/components/map-component"

export default function App() {
  // return <Dropdown />
  return (
    <main className="flex bg-slate-100 dark:bg-slate-900 h-auto flex-col w-full min-h-[100dvh] justify-between">
      {/* <div classNameName="w-full h-full flex-grow bg-blue-100"> */}
      <Counter />
      {/* <MapComponent /> */}
      {/* <PlaceHolderMap />
      <div className="container absolute w-full sm:max-w-xs h-auto
       bg-blue-100/1 p-[10px]
      flex flex-col gap-2 "> */}
    </main>
  );
}
