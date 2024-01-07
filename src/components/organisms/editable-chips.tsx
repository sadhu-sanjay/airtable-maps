import { useState } from "react";
import Chip from "~/components/molecules/chip";
import { DropdownItem } from "~/components/models/types";
import SearchBar from "../search-bar";
import EditButton from "../atoms/edit-button";

type EditableChipsProps = {
  label: string;
  chips: DropdownItem[];
  onAdd: (chip: string) => void;
  onDelete: (chip: string) => void;
};

export const EditableChips: React.FC<EditableChipsProps> = ({
  label,
  chips,
  onAdd,
  onDelete,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  const handleDelete = (chip: string) => {
    onDelete(chip);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex-row  "
      {chips.map((item) => (
        <Chip
          key={item.value}
          item={item}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ))}
      <EditButton
        className=""
        onClick={() => console.log("Edit Tags")}
        btnHeight={20}
        btnWidth={20}
      />
      {/* <input
        type="search"
        id="default-search"
        value={inputValue}
        className="inline w-full px-2 py-1 text-sm 
          text-gray-900 border border-gray-300 rounded
          bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={`Search ${label}`}
        // required
        onChange={(e) => {
          let value = e.target.value;
          setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      /> */}
    </div>
  );
};
