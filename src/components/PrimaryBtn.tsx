import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  type: "button" | "submit";
}

const PrimaryBtn = ({ children, type, onClick }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-8 w-auto px-4 rounded-lg border bg-[#03624C] hover:bg-[#2cc295] text-white cursor-pointer  transition-colors duration-200 ease-in-out"
    >
      {children}
    </button>
  );
};

export default PrimaryBtn;
