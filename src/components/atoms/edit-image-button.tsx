import { ImageEditIcon } from "../resources/icons/image-edit-icons";

const ImageEditButton = ({
  onClick,
  className,
  btnWidth = 24,
  btnHeight = 24,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className: string;
  btnWidth?: number;
  btnHeight?: number;
}) => (
  <button
    onClick={onClick}
    className={` border bg-white shadow-sm p-1 text-sm font-medium text-gray-900 rounded-4px
     border-gray-200 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4
      focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800
       dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700
       inline-flex items-center w-8 h-8
    ${className}`}
  >
    <ImageEditIcon width="100%" height="100%" />
  </button>
);

export default ImageEditButton;
