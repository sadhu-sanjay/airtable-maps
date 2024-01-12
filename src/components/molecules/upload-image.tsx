import React from "react";
import { ImageEditIcon } from "../resources/icons/image-edit-icons";
import { toast } from "sonner";

type UploadImageComponentProps = {
  onUpload: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className: string;
};

const UploadImageComponent: React.FC<UploadImageComponentProps> = ({
  onUpload,
  className,
}) => {
  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log("files", files);
    if (files) {
      console.log("Pass files", files);
      onFileUpload(files[0]);
    }
  };

  const onFileUpload = async (file: File) => {
    if (!file) {
      throw new Error("File is undefined");
    }

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      // handle the error
      if (!res.ok) {
        const error = await res.text();
        toast.error(error);
        throw new Error(error);
      }
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      toast.error("Upload failed");
    }
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
        className="hidden"
        onChange={onFileSelected}
      />
    </label>
  );
};

export { UploadImageComponent };
