import DeleteIcon from "./delete-icon";

const DeleteButton = ({
  title = "Delete",
  className,
  onClick,
  showIcon = false,
}: {
  title: string;
  onClick: () => void;
  className?: string;
  showIcon?: boolean;
}) => (
  <button
    onClick={onClick}
    type="submit"
    className="rounded-4px px-4 py-2 mx-2 my-4 text-center 
          text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 
          hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
          dark:focus:ring-red-800 shadow-sm shadow-red-500/50 dark:shadow-sm 
          dark:shadow-red-800/80 font-medium text-sm "
  >
    {showIcon && <DeleteIcon width={20} height={20} className="mr-2 inline" />}
    {title}
  </button>
);

export default DeleteButton;
