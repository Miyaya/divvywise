import Image from "next/image";

export default function Nav({ setActiveTab }) {

  return (<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-gray-300">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center justify-center w-full"
        >
          <Image src="/banknotes.svg" alt="Dashboard" width={24} height={24} />
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className="flex items-center justify-center w-full"
        >
          <Image src="/plus.svg" alt="Add" width={24} height={24} />
        </button>

        <button
          onClick={() => setActiveTab("setting")}
          className="flex items-center justify-center w-full"
        >
          <Image src="/cog-6-tooth.svg" alt="Settings" width={24} height={24} />
        </button>
      </div>
    </div>
  </footer>)
}