import DeleteIcon from "./delete-icon";

const CancelButton = ({
  title = "Close",
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
    className=" rounded-4px px-4 py-2 mx-2 my-4 text-center 
          text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 
          hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
          dark:focus:ring-gray-800 shadow-sm shadow-gray-500/50 dark:shadow-sm 
          dark:shadow-gray-800/80 font-medium text-sm "
  >
    {showIcon && <DeleteIcon width={20} height={20} className="mr-2 inline" />}
    {title}
  </button>
);

export default CancelButton;
