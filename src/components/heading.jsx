import { images } from "../config/images.config";
import { links } from "../config/links.config";

export default function Heading() {
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center gap-12 py-12 text-zinc-100">
        <div className="flex-1 flex flex-col items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <p className="font-kronaone text-6xl lg:text-8xl leading-tight">GD KenyBot</p>
            <p className="mt-4 text-2xl md:text-3xl text-zinc-300">Geometry Dash notifications & utilities bot</p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            <a className="flex w-full md:w-auto items-center justify-center gap-2 h-12 px-4 rounded-md text-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-100" href={links.ADD}>
              <img src={images.PLUS} alt="plus" className="w-7 h-7" />
              <span>Add App</span>
            </a>
            <a className="flex w-full md:w-auto items-center justify-center gap-2 h-12 px-4 rounded-md text-lg border border-zinc-700 hover:border-zinc-600 text-zinc-100 bg-transparent" href={links.SENDS_AND_RATES}>
              <img src={images.SENDS_AND_RATES} alt="sends and rates" className="w-9 h-6" />
              <span>Sends & Rates</span>
            </a>
          </div>
        </div>
        <div className="w-full flex justify-center items-center md:w-1/3">
          <img src={images.ICON} alt="GD KenyBot icon" className="max-h-[40vh] md:max-h-[60vh] w-auto object-contain" />
        </div>
      </div>
    </main>
  )
}
