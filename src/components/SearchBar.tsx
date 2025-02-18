import { IoIosSearch } from "react-icons/io";

interface Props {
  search: string;
  placeholder: string;
  setSearch: (str: string) => void;
}

const SearchBar = ({ search, placeholder, setSearch }: Props) => {
  return (
    <div className="h-full w-64 border border-gray-500 rounded-xl p-1 flex items-center gap-2">
      <IoIosSearch size={24} color="#6a7282" />
      <input
        className="w-full h-full focus:outline-none"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      ></input>
    </div>
  );
};

export default SearchBar;
