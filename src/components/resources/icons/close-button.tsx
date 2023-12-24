import CloseIcon from "./close-icon";

const CloseButton = ({
  className,
  onClick,
}: {
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`${className} border p-1 text-sm font-medium text-gray-900 bg-white rounded-md border-gray-200 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center`}
  >
    <CloseIcon />
  </button>
);

export default CloseButton;
