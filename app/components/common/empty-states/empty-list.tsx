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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="m-auto icon icon-tabler icon-tabler-mood-empty-filled"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 10.66h-6l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h6l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-5.99 -5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm6 0l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z"
                  strokeWidth="0"
                  fill="gray"
                />
              </svg>
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
