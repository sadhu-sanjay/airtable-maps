/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { ImagePlaceHolder } from "../resources/placeHolder/image";
import EditButton from "../atoms/edit-button";

type ImageSliderProps = {
  images: any[];
  isFullScreen: boolean;
  setIsFullScreen: (isFullScreen: boolean) => void;
};

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  isFullScreen,
  setIsFullScreen,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [isFullScreen, setIsFullScreen] = useState(false);

  const handleNextClick = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex(
      (currentImageIndex - 1 + images.length) % images.length
    );
  };

  return (
    <>
      <div
        id="default-carousel"
        className={` w-full h-full relative`}
        data-carousel="slide"
      >
        <div
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="relative h-full overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-900"
        >
          {images &&
            images?.map((item: any, index: number) => (
              <div
                key={index}
                className={`duration-700 ease-in-out ${
                  index === currentImageIndex ? "block" : "hidden"
                }`}
                data-carousel-item
              >
                <img
                  src={
                    isFullScreen
                      ? item.thumbnails?.full.url
                      : item.thumbnails?.large.url
                  }
                  className={`absolute block w-full h-full 
                  ${isFullScreen ? "object-contain" : "object-cover"}
                    -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2`}
                  alt=""
                />
              </div>
            ))}
          {!images && <ImagePlaceHolder />}
          <EditButton
            className={`absolute ${
              !isFullScreen && "w-6 h-6 "
            } bottom-6 right-6 z-30 opacity-70`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>

        <div className={`${images?.length > 1 ? "block" : "hidden"}`}>
          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
            {images?.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-gray-300"
                }`}
                aria-current={index === currentImageIndex}
                aria-label={`Slide ${index + 1}`}
                data-carousel-slide-to={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              ></button>
            ))}
          </div>
          <button
            type="button"
            className=" absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
            onClick={(e: any) => {
              e.stopPropagation();
              handlePrevClick();
            }}
          >
            <span
              className={`${
                isFullScreen ? "w-10 h-10" : "w-8 h-8"
              } inline-flex items-center justify-center rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none`}
            >
              <svg
                className="w-4 h-4 text-white dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
            onClick={(e) => {
              e.stopPropagation();
              handleNextClick();
            }}
          >
            <span
              className={`${
                isFullScreen ? "w-10 h-10" : "w-8 h-8"
              } inline-flex items-center justify-center  rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none`}
            >
              <svg
                className="w-4 h-4 text-white dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
