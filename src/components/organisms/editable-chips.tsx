import { useEffect, useState, useRef } from "react";
import Chip from "~/components/molecules/chip";
import { Tag } from "~/components/models/types";
import EditButton from "../atoms/edit-button";
import EditableChipsDropdown from "../common/dropdown/editable-chips-dropdown";
import { toast } from "sonner";
import SaveButton from "../atoms/save-button";

type EditableChipsProps = {
  label: string;
  data: Tag[];
  initialTags: string[];
  onSubmit: (tags: Tag[]) => void;
};

export const EditableChips: React.FC<EditableChipsProps> = ({
  label,
  data,
  initialTags,
  onSubmit,
}) => {
  console.log("RENDEr EditableChips");

  const [isEditing, setIsEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const [selectedData, setSelectedData] = useState<Tag[]>(
    data && data.filter((item) => initialTags.includes(item.name))
  );

  const handleDelete = (chip: Tag) => {
    setSelectedData(selectedData.filter((item) => item.id !== chip.id));
    data.push(chip);
  };

  // useEffect(() => {
  //   function handleClickOutside(event: any) {
  //     if (divRef.current && !divRef.current.contains(event.target)) {
  //       setIsEditing(false);
  //       toast.success("Saved");
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
          key={item.id}
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
          data={data.filter((item) => !selectedData.includes(item))}
          itemGotSelected={(item: Tag) => {
            data.splice(data.indexOf(item), 1);
            setSelectedData([...selectedData, item]);
          }}
        />
      )}
    </div>
  );
};
