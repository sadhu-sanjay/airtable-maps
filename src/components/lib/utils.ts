import defaultColors from 'tailwindcss/colors';



export const randomColor = () => {
  const colors = Object.keys(defaultColors);
  const color = colors[Math.floor(Math.random() * colors.length)];
  console.log("Sanjay Color", color);
  return color
}

export const myDebounce = (func: any, wait: number) => {
  let timeout: any;
  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export function areCoordinatesInBounds(lat: number, lng: number, bounds: google.maps.LatLngBounds) {
  let west = bounds.getSouthWest().lng();
  let east = bounds.getNorthEast().lng();

  if (west > east) { // The map crosses the 180 degrees longitude line
    if (lng < 0) {
      lng += 360; // Convert the marker's longitude to the [0, 360) range
    }
    if (west < 0) {
      west += 360; // Convert the west bound's longitude to the [0, 360) range
    }
    if (east < 0) {
      east += 360; // Convert the east bound's longitude to the [0, 360) range
    }
  }

  return lat >= bounds.getSouthWest().lat() && lat <= bounds.getNorthEast().lat() && lng >= west && lng <= east;
}