import { useState } from "react";
import Chip from "~/components/molecules/chip";
import { DropdownItem } from "~/components/models/types";

type Props = {
  chips: DropdownItem[];
  onAdd: (chip: string) => void;
  onDelete: (chip: string) => void;
};

export const EditableChips = ({ chips, onAdd, onDelete }: Props) => {
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
    <div className="flex flex-wrap gap-2 ">
      {chips.map((item) => (
        <Chip
          key={item.value}
          item={item}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      ))}
      <input
        id="standard-basic"
        placeholder="Add new"
        value={inputValue}
        onChange={(e: any) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
