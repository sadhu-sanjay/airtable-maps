import face from "~/app/components/resources/svg/fronyface.svg";
import { FronnyFace } from "../../resources/svg/fronyface";

export default function EmptyList({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <FronnyFace />
              <h1 className="text-1xl font-bold tracking-tighter sm:text-2xl xl:text-3xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-500 dark:text-gray-300 dark:from-black dark:to-gray-800">
                {title}
              </h1>
            </div>
            <div className="w-full max-w-sm space-y-2 mx-auto">
              <button
                onClick={() => window.location.reload()}
                type="button"
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-sm shadow-blue-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-md text-sm px-5 py-2.5 text-center mr-2 mb-2 "
              >
                Retry
              </button>
              <p className="text-xs text-zinc-500 dark:text-zinc-100">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
