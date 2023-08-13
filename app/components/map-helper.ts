import { Record } from "~/app/components/types"

export function calculateBounds(selectedRecord: Record | null, filteredRecords: Record[]) {
    let minLat = Number.MAX_VALUE;
    let maxLat = -Number.MAX_VALUE;
    let minLng = Number.MAX_VALUE;
    let maxLng = -Number.MAX_VALUE;
  
    filteredRecords.forEach((record) => {
      const { lat, lng } = record.fields;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
  
    if (selectedRecord) {
      minLat = Math.min(minLat, selectedRecord.fields.lat);
      maxLat = Math.max(maxLat, selectedRecord.fields.lat);
      minLng = Math.min(minLng, selectedRecord.fields.lng);
      maxLng = Math.max(maxLng, selectedRecord.fields.lng);
    }
  
    return {
      south: minLat,
      west: minLng,
      north: maxLat,
      east: maxLng,
    };
  }
  