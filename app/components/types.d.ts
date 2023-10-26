export type Record = {

  constructor: (record: MyRecord) => void;
  id: string;
  fields: {
    id: string;
    sNo: number;
    SearchString: string;
    lat: number;
    lng: number;
    Title: string;
    Region: string[];
    City: string;
    "Coordinates (lat, lng)": string;
    Tags: string[];
    "State / AAL1": string;
    Country: string;
    Description: string;
    Status: string;
    URL: string;
    Image: any[];
    Address: string;
    StreetNumber: string;
    Street: string;
    PostalCode: string;
    Neighborhood: string;
    Altitude: string;
    date: string;
    updated: string;
    Geocache?: string;
    "County / AAL2": string;
    RecommendedBy: string;
    Phone: string;
  }
};
