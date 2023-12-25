import DeleteIcon from "./delete-icon";

const DeleteButton = ({
  className,
  onClick,
}: {
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`my-2 py-1.5 px-3 text-sm font-medium text-gray-200 bg-red-700 rounded-4px border-gray-200 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-red-900 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center 
         ${className}`}
  >
    DELETE
    <DeleteIcon width={24} height={24} className="ml-2" />
  </button>
);

export default DeleteButton;
