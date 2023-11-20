import { Record } from "./types";
const marker_icon = "/marker.png";
import { RECORD_IMAGE_URL, SERVER_URL } from "../config";

export default function Marker(record: Record, showImg: boolean) {
  const title = record.Title ?? "";
  const markerDiv = document.createElement("div");
  markerDiv.classList.add("marker");

  const imgDiv = document.createElement("img");
  imgDiv.classList.add("marker-img");
  imgDiv.src = RECORD_IMAGE_URL(record.RecordKey);
  imgDiv.onload = (ev: any) => {
    ev.target.style.boxShadow =
      "0 0 0 2px white, 0.2em 0.2em 0.5em rgba(128, 128, 128, 0.6)"; // Change the color to gray
  };
  imgDiv.onerror = (ev: any) => {
    ev.target.src = "";
    ev.target.style.border = "none";
    ev.target.style.boxShadow = "none";
  };

  // Create a new div for the title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("marker-title");
  titleDiv.innerText = title + " " + markerCategory(record.Tags);

  markerDiv.appendChild(imgDiv);
  markerDiv.appendChild(titleDiv); // Append the title div to the marker div

  const marker = new window.google.maps.marker.AdvancedMarkerElement({
    position: { lat: record.lat, lng: record.lng },
    content: markerDiv,
  });

  return marker;
}

function markerCategory(tags: string): string {
  if (!tags) return "";

  // turn array of tags into a string and remove whitespace and commas
  if (tags.includes("Motorcycle")) return "🏍️";
  if (tags.includes("Camping")) return "🏕️";
  if (tags.includes("UNESCO")) return "🏛️";
  if (tags.includes("Amusement Park")) return "🎡";
  if (tags.includes("Restaurant")) return "🍽️";
  if (tags.includes("Hotel")) return "🏨";
  if (tags.includes("Swimming")) return "🏊";
  if (tags.includes("ToTry")) return "🎯";
  if (tags.includes("Art")) return "🎨";
  if (tags.includes("Food")) return "🍔";
  if (tags.includes("Hiking") || tags.includes("Rock Climbing")) return "🥾";
  if (tags.includes("Nature")) return "🌳";
  if (tags.includes("Shopping")) return "🛍️";
  if (tags.includes("Sightseeing")) return "🏛️";
  if (tags.includes("Sports")) return "🏀";
  if (tags.includes("Drive")) return "🚗";
  if (tags.includes("Culture")) return "🎭";
  if (tags.includes("History")) return "📜";
  if (tags.includes("Relax")) return "🧘";
  if (tags.includes("Beach")) return "🏖️";
  if (tags.includes("Nightlife")) return "🍻";
  if (tags.includes("Music")) return "🎵";
  if (tags.includes("Architecture") || tags.includes("Museum")) return "🏛️";
  if (tags.includes("Park")) return "🌳";
  if (tags.includes("Zoo")) return "🐘";
  if (tags.includes("Aquarium")) return "🐠";
  if (tags.includes("Bar")) return "🍻";
  if (tags.includes("Activities")) return "🏄";
  return "";
}
