import { useEffect, useState, useRef } from "react";
import Chip from "~/components/molecules/chip";
import { DropdownItem } from "~/components/models/types";
import EditButton from "../atoms/edit-button";
import EditableChipsDropdown from "../common/dropdown/editable-chips-dropdown";
import { toast } from "sonner";
import SaveButton from "../atoms/save-button";

type EditableChipsProps = {
  label: string;
  data: DropdownItem[];
  tags: DropdownItem[];
  onSubmit: (tags: DropdownItem[]) => void;
};

export const EditableChips: React.FC<EditableChipsProps> = ({
  label,
  data,
  tags,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [selectedData, setSelectedData] = useState<DropdownItem[]>(tags);

  // const handleAdd = () => {
  //   if (inputValue) {
  //     onAdd(inputValue);
  //     setInputValue("");
  //   }
  // };

  const handleDelete = (chipId: string) => {
    setSelectedData(selectedData.filter((item) => item.value !== chipId));
  };

  // useEffect(() => {
  //   function handleClickOutside(event: any) {
  //     if (divRef.current && !divRef.current.contains(event.target)) {
  //       setIsEditing(false);
  //       toast.success("Saved");
  //       // Save your editing state here
  //     }
  //   }

  //   // Bind the event listener
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     // Unbind the event listener on clean up
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [divRef]);

  return (
    <div
      className={`
      relative flex flex-wrap rounded dark:bg-blue-700 gap-2 p-2`}
      ref={divRef}
      tabIndex={-1}
    >
      {selectedData?.map((item) => (
        <Chip
          key={item.value}
          item={item}
          onDelete={handleDelete}
          isEditing={isEditing}
        />
      ))}
      {isEditing ? (
        <SaveButton
          onClick={() => {
            setIsEditing(false);
            onSubmit(selectedData);
          }}
        />
      ) : (
        <EditButton
          onClick={() => {
            setIsEditing(true);
          }}
          className="w-7 h-7"
        />
      )}
      {isEditing && (
        <EditableChipsDropdown
          className="absolute top-full left-0 "
          label={label}
          placeholder={label}
          isLoading={false}
          data={data.map((tag: any) => ({
            label: tag.name,
            value: tag.id,
            color: tag.color,
          }))}
          itemGotSelected={(item: DropdownItem) => {
            data.splice(data.indexOf(item), 1);
            setSelectedData([...selectedData, item]);
          }}
        />
      )}
    </div>
  );
};
