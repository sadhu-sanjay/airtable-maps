// A component which picks and uploads a file to the server
// using the file upload api from airtable and returns the url

import { useState } from "react";
import { FileUpload } from "../atoms/buttons/file-upload";
import { toast } from "sonner";
import { POST } from "~/api/airtable/route";

type UploadComponentProps = {
  label: string;
  onUpload: (url: string) => void;
};

const UploadComponent: React.FC<UploadComponentProps> = ({
  label,
  onUpload,
}) => {

  const [file, setFile] = useState<File>();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const onFileUpload = async () => {
    if (file) {
      toast.promise(
        POST({ table: "images", data: { name: file.name } }, file),
        {
          loading: "Uploading...",
          success: (data) => {
            onUpload(data.url);
            return "Upload successful";
          },
          error: "Upload failed",
        }
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileUpload label={label} onChange={onFileSelected} />
      <button
        onClick={onFileUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>
    </div>
  );
};

export default UploadComponent;
