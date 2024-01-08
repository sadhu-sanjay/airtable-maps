import { useEffect, useState, useRef } from "react";
import Chip from "~/components/molecules/chip";
import { DropdownItem } from "~/components/models/types";
import SearchBar from "../search-bar";
import EditButton from "../atoms/edit-button";
import Dropdown from "../common/dropdown/dropdown";
import DropdownMultiSelect from "../common/dropdown/dropdown-multiSelect";
import DropdownCopy from "../common/dropdown/dropdown copy";
import { toast } from "sonner";
import { PlusIcon } from "../resources/icons/plus-icon";
import { PlusCircleIcon } from "../resources/icons/plus-circle-icon";

type EditableChipsProps = {
  label: string;
  data: DropdownItem[];
  onAdd: (chip: string) => void;
  onDelete: (chip: string) => void;
  tags: DropdownItem[];
};

export const EditableChips: React.FC<EditableChipsProps> = ({
  label,
  data,
  onAdd,
  onDelete,
  tags,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [selectedData, setSelectedData] = useState<DropdownItem[]>(tags);

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

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsEditing(false);
        toast.success("Saved");
        // Save your editing state here
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <div
      className="relative flex flex-wrap bg-blue-200 dark:bg-blue-700 gap-2 p-2"
      ref={divRef}
    >
      {selectedData?.map((item) => (
        <Chip
          key={item.value}
          item={item}
          onAdd={handleAdd}
          onDelete={handleDelete}
          isEditing={isEditing}
        />
      ))}
      <PlusCircleIcon onClick={() => setIsEditing(true)} className="w-6 h-6" />
      {isEditing && (
        <DropdownCopy
          className="absolute top-full left-0 "
          label={label}
          placeholder={label}
          isLoading={false}
          data={data}
          itemGotSelected={(item) => {
            setSelectedData([...selectedData, item]);
          }}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};
