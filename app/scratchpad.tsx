const newMarkersInRecords =
      new Set<google.maps.marker.AdvancedMarkerElement>();

    records!.forEach((record) => {
      if (!record.fields.lat || !record.fields.lng) return;
      if (record_to_marker_map.current.has(record.id)) {
        const marker = record_to_marker_map.current.get(record.id);
        if (!marker) return;
        newMarkersInRecords.add(marker);
      } else {
        const marker = MyMarker({ record, onMarkerClick });
        if (marker) {
          record_to_marker_map.current.set(record.id, marker);
          newMarkersInRecords.add(marker);
        }
      }
    });

    // Update the cluster with only the markers in records
    // console.log("Cluster", clusterRef.current);
    clusterRef.current!.addMarkers(Array.from(newMarkersInRecords));

    // Clean up markers that are no longer in records
    markersInRecords.forEach((marker) => {
      if (!newMarkersInRecords.has(marker)) {
        clusterRef.current?.removeMarker(marker);
        marker.map = null;
      }
    });

    // Update the markersInRecords set
    markersInRecords.clear();
    newMarkersInRecords.forEach((marker) => markersInRecords.add(marker));