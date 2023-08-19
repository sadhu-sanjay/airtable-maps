export type Record = {
  id: string;
  createdTime: string;
  fields: {
    searchStr: string;
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
    Image: string;
    Address: string;
    StreetNumber: string;
    Street: string;
    PostalCode: string;
    Neighborhood: string;
    Altitude: string;
    Updated: string;
    Geocache: string;
    "County / AAL2": string;
    RecommendedBy: string;
    Phone: string;
  };
};

