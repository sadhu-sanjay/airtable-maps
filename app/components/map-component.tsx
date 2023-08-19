"use client";

import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Spinner, Spinner2 } from "~/app/components/spinner";
import { Record } from "~/app/components/types";
import {
  MAPS_API_KEY,
  RECORDS_FETCH_URL,
  clusterThreshHold,
} from "~/app/config";
import { fetchAirtableRecords, fetchsql, sampleFetch } from "./airtable-helper";
import { MyList } from "./List";
import { MyMap } from "./my-map";

export function MapComponent() {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div>Error Loading Map</div>;
      case Status.SUCCESS:
        return (
          <MyMap
            {...mapOptions}
            filteredRecords={filteredRecords}
            selectedRecord={selectedRecord}
            records={records}
          />
        );
    }
  };
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
  };
  

  const filteredRecords = records
    ? records.filter((record) =>
        // record.fields.category.includes(category) &&
        record.fields.searchStr.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  function fetchRecords() {
    setIsLoading(true);
    console.log("fetchRecords trigger", RECORDS_FETCH_URL);
    fetch(RECORDS_FETCH_URL, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Come ther result", data[0]);
        setRecords(data);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    setIsLoading(true);
    fetchRecords();

    // sampleFetch()
  }, []);

  return (
    <div className="w-full h-full px-2 sm:px-16 pt-2 ">
      <div className="rounded-sm z-20 p-4 gap-2 shadow-sm bg-slate-50 dark:bg-gray-800 flex items-stretch justify-between">
        <h1 className="self-center text-xl font-bold dark:text-slate-200">
          Airtable Records
        </h1>
        <div className="flex ">
          <input
            type="text"
            placeholder="Search..."
            className="w-[100%] p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleSearchChange}
          />
        </div>
        <select
          value={category}
          onChange={handleCategoryChange}
          id="countries"
          className=" bg-gray-50 w-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Hiking">Hiking</option>
          <option value="Airport">Airport</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Lake">Lake</option>
          <option value="Pub">Pub</option>
        </select>
      </div>
      <div
        className="w-full h-full flex flex-col-reverse sm:flex-row relative
     bg-gray-100 dark:bg-gray-800 shadow-sm rounded-md border "
      >
        <div className=" w-20 h-8 top-0 right-0 p-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => fetchRecords()}
          >
            Refresh Button
          </button>
        </div>
        <MyList
          isLoading={isLoading}
          filteredRecords={filteredRecords}
          setSelectedRecord={setSelectedRecord}
          records={records}
        />
        <Wrapper apiKey={MAPS_API_KEY} render={render} />
      </div>
    </div>
  );
}
const mapOptions = {
  center: { lat: 47.4351810744086, lng: 3.0833809671533285 },
  zoom: 4,
};
