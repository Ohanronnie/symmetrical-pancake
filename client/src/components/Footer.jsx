import { HomeIcon } from "@heroicons/react/24/outline";
export default function Footer() {
  return (
    <div className="btm-nav bottom-0 z-10  border-t-[1px] border-gray-800 border-solid bg-opacity-50 backdrop-filter backdrop-blur">
      <button className="text-white bg-gray-900">
        <HomeIcon className="h-5 w-5" />
      </button>
      <button className="active text-white bg-gray-900">
        <HomeIcon className="h-5 w-5" />
      </button>
      <button className="text-white bg-gray-900">
        <HomeIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
