export type Record = {
  id: string;
  createdTime: string;
  fields: {
    lat: number
    lng: number
    Title: string;
    Region: string[];
    City: string;
    "Coordinates (lat, lng)": string;
    Tags: string[];
    "State / AAL1": string;
    Country: string;
  };
};
