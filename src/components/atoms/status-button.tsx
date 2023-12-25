import RefreshCircle from "~/components/resources/icons/refresh-spinner";
import IconRefresh from "~/components/resources/icons/refresh-icon";
import React, { useCallback, useEffect, useState } from "react";
import { VIEW_DATA_RELOAD, VIEW_RELOAD_STATUS } from "~/config";

const StatusButton: React.FC<{
  viewKey: string;
}> = ({ viewKey }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getStatus(signal);

    return () => {
      abortController.abort();
    };
  });

  const getStatus = useCallback(
    (signal: AbortSignal) => {
      const queryParma = "?viewKey=" + viewKey;
      const finalUrl = VIEW_RELOAD_STATUS + queryParma;

      fetch(finalUrl, { signal })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "Started") {
            setIsLoading(true);
            setTimeout(() => {
              getStatus(signal);
            }, 5000);
          } else if (data.status === "Finished") {
            setIsLoading(false);
          }
        })
        .catch((e) => {
          if (e.name === "AbortError") {
            console.log("Fetch Items Aborted StatusButton");
          } else {
            console.error("View Reload status ==> ", e);
          }
          setIsLoading(false);
        });
    },
    [viewKey]
  );

  const startUpdate = useCallback(
    (signal: AbortSignal) => {
      const queryParma = "?viewKey=" + viewKey;
      const finalUrl = VIEW_DATA_RELOAD + queryParma;

      console.log("Start Update", finalUrl);
      setIsLoading(true);
      fetch(finalUrl, { signal })
        .then((res) => res.json())
        .then((data) => {
          getStatus(signal);
        })
        .catch((e) => {
          if (e.name === "AbortError") {
            console.log("Fetch Items Aborted StatusButton");
          } else {
            console.error("Error VIEW_DATA_RELOAD ==> ", e);
          }
          setIsLoading(false);
        });
    },
    [getStatus, viewKey]
  );

  return (
    <button
      type="button"
      onClick={(e) => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        startUpdate(signal);
      }}
      className="py-1 px-2 mr-2 text-sm font-medium text-gray-900 bg-white rounded-4px border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
    >
      {isLoading ? <RefreshCircle /> : <IconRefresh />}
    </button>
  );
};

export default React.memo(StatusButton);
