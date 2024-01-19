import React from "react";
import { ImageEditIcon } from "../resources/icons/image-edit-icons";
import { toast } from "sonner";
import { Record } from "../models/types";

type ImagePickerProps = {
  onDonePicking: (imageFile: File) => void;
  className: string;
  record: any;
};

const ImagePicker: React.FC<ImagePickerProps> = ({
  onDonePicking,
  className,
  record,
}) => {
  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onFileUpload(files[0]);
    }
  };

  const onFileUpload = async (file: File) => {
    if (!file) {
      throw new Error("File is undefined");
    }
    onDonePicking(file);
  };

  return (
    <label
      htmlFor="dropzone-file"
      className={`
    cursor-pointer
    border bg-white shadow-sm p-1 text-sm font-medium text-gray-900 rounded-4px
    border-gray-200 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4
     focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800
      dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700
      inline-flex items-center w-8 h-8 ${className}`}
    >
      <ImageEditIcon width="100%" height="100%" />
      <input
        id="dropzone-file"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelected}
      />
    </label>
  );
};

export { ImagePicker };
