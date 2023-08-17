import { Record } from "~/app/components/types"

export function calculateBounds(selectedRecord: Record | null, filteredRecords: Record[]) {
  const MAX_LAT = 85;
  const MIN_LAT = -85;
  const MAX_LNG = 180;
  const MIN_LNG = -180;

  let firstValidRecord, lastValidRecord;

  let i = 0;
  while (!firstValidRecord && i < filteredRecords.length) {
    const record = filteredRecords[i];
    if (record.fields.lat && record.fields.lng) {
      firstValidRecord = record;
    } else {
      i++;
    }
  }

  let j = filteredRecords.length - 1;
  while (!lastValidRecord && j >= 0) {
    const record = filteredRecords[j];
    if (record.fields.lat && record.fields.lng) {
      lastValidRecord = record;
    } else {
      j--;
    }
  }

  let minLat = firstValidRecord ? firstValidRecord.fields.lat : MAX_LAT;
  let maxLat = lastValidRecord ? lastValidRecord.fields.lat : MIN_LAT;
  let minLng = firstValidRecord ? firstValidRecord.fields.lng : MAX_LNG;
  let maxLng = lastValidRecord ? lastValidRecord.fields.lng : MIN_LNG;

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
