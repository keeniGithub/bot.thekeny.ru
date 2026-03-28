import Navbar from "./components/navbar";
import Heading from "./components/heading";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-linear-to-b from-zinc-800 via-zinc-900 to-black text-zinc-100 antialiased">
      <Navbar/>
      <Heading/>
    </div>
  )
}