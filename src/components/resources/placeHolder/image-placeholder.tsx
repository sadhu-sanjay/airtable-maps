
export const ImagePlaceHolder: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    // <div className="col-span-full w-full h-full p-4 ">
    //   <div
    //     className="
    //     w-full h-full
    //   flex justify-center rounded-lg border items-center
    //   border-dashed
    //   border-gray-900/25
    //   dark:border-gray-100/25
    //   px-6 py-10"
    //   >
    //     <div className="text-center">
    //       <Image src="/place.svg" alt="fronyface" width={48} height={48} />
    //       <div className="mt-4 flex text-sm leading-6 text-gray-600">
    //         <label
    //           htmlFor="file-upload"
    //           className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
    //         >
    //           <span>Upload a file</span>
    //           <input
    //             id="file-upload"
    //             name="file-upload"
    //             type="file"
    //             className="sr-only"
    //           />
    //         </label>
    //         <p className="pl-1">or drag and drop</p>
    //       </div>
    //       <p className="text-xs leading-5 text-gray-600">
    //         PNG, JPG, GIF up to 10MB
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div
      className={`${className} flex border items-center justify-center h-full bg-gray-300 dark:bg-gray-700 ${className}`}
    >
      <svg
        className="w-10 h-10 text-gray-200 dark:text-gray-600 "
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 20"
      >
        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
      </svg>
    </div>
  );
};
