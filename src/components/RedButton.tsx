import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  type: "button" | "submit";
}

const RedButton = ({ children, type, onClick }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-8 rounded-md max-w-24 gap-1 p-2 flex items-center justify-center bg-rose-800 text-white font-semibold text-sm cursor-pointer hover:bg-rose-700 transition-colors duration-200 ease-in-out"
    >
      {children}
    </button>
  );
};

export default RedButton;
