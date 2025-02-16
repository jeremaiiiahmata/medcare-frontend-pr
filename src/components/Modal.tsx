import { ReactNode } from "react";
import { IoIosClose } from "react-icons/io";

interface Props {
  title: string;
  children: ReactNode;
  setIsOpen: (bool: boolean) => void;
}

const Modal = ({ title, children, setIsOpen }: Props) => {
  return (
    <div className="inset-0 items-center justify-center flex h-full w-full bg-black/70 absolute z-10 ">
      <div className="bg-white h-[35rem] w-[32rem] p-2 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <IoIosClose
            size={24}
            onClick={() => {
              setIsOpen(false);
            }}
            className="hover:scale-125 cursor-pointer"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
