import { useState } from "react";
import EditButton from "../atoms/edit-button";
import { SubTitle } from "../atoms/labels/sub-title";
import SaveButton from "../atoms/save-button";
import CloseButton from "../resources/icons/close-button";
import { toast } from "sonner";
import { PATCH } from "~/api/airtable/route";

type EditableTextProps = {
  value: string;
  onSave: (text: string) => void;
};

const EditableText: React.FC<EditableTextProps> = ({ value, onSave }) => {
  const [text, setText] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const hasTextChanged = text !== value;

  const onEditClicked = () => {
    setIsEditing(!isEditing);
  };

  const onCloseClicked = () => {
    setIsEditing(false);
    setText(value);
  };
  const onSaveClicked = () => {
    setIsEditing(false);
    onSave(text);
  };

  return (
    <div className="relative">
      {!isEditing && (
        <div>
          <EditButton className="float-right" onClick={onEditClicked} />
          <SubTitle value={text} />
        </div>
      )}
      {isEditing && (
        <div
          className="border flex items-center gap-1 float-right absolute bottom-0 right-0
        bg-white dark:bg-gray-800 rounded-md border-gray-200 dark:border-gray-600
        p-1 m-2 shadow-lg "
        >
          <CloseButton onClick={onCloseClicked} />
          <SaveButton
            onClick={onSaveClicked}
            // className={`${hasTextChanged ? "block" : "hidden"} `}
          />
        </div>
      )}
      {isEditing && (
        <textarea
          id="message"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      )}
    </div>
  );
};

export default EditableText;
