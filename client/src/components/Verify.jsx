import { CheckBadgeIcon } from "@heroicons/react/20/solid";
export default function Verify({ verified }) {
  return (
    verified && <CheckBadgeIcon className="h-4 w-4 inline text-[#008fff]" />
  );
}
