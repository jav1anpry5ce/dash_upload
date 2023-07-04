import { FaFolder } from "react-icons/fa";
const folder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1];

export default function Loading() {
  return (
    <div className="absolute left-[50%] top-[50%] flex max-w-xs translate-x-[-50%] translate-y-[-50%] flex-wrap items-center gap-6">
      {folder.map((f) => (
        <FaFolder
          key={f}
          fontSize={60}
          className="animate-pulse text-gray-500/30"
        />
      ))}
    </div>
  );
}
