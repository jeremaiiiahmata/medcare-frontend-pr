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
      className="h-8 rounded-lg border w-24 bg-green-900 text-white cursor-pointer hover:bg-green-800 transition-colors duration-200 ease-in-out"
    >
      {children}
    </button>
  );
};

export default PrimaryBtn;
