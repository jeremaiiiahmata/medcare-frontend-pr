import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  type: "button" | "submit";
}

const SecodaryBtn = ({ children, type, onClick }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-green-300 text-green-900 rounded-lg h-8 w-24 cursor-pointer hover:bg-green-200 transition-colors duration-200 ease-in-out"
    >
      {children}
    </button>
  );
};

export default SecodaryBtn;
