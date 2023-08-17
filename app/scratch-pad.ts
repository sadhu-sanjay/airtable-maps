const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'My@Sql8',
    database: 'test'
  });

console.log("title=> ", Title + '\n' + "description=> ", Description + '\n' + "coordinates=> ", Coordinates + '\n' + "state=> ", State + '\n' + "status=> ", Status + '\n' + "tags=> ", Tags + '\n' + "url=> ", URL + '\n' +
"image=> ", Image + '\n' + "address=> ", Address + '\n' + "streetNumber=> ", StreetNumber + '\n' + "street=> ", Street + '\n' + "postalCode=> ", PostalCode + '\n' + "region=> ", Region + '\n'
+ "neighborhood=> ", Neighborhood + '\n' + "altitude=> ", Altitude + '\n' + "date=> ", dateString + '\n' + "updated=> ", updated + '\n' + "geocache=> ", Geocache + '\n' +
"city=> ", City + '\n' + "county=> ", County + '\n' + "country=> ", Country + '\n' + "recommendedBy=> ", RecommendedBy + '\n' + "phone=> ", Phone + '\n');


const markers = filteredRecords?.map((value) => {
  const marker = new google.maps.Marker({
    position: { lat: value.fields.lat, lng: value.fields.lng },
  });
  return marker
});

useEffect(() => {
  const mc = new MarkerClusterer({
    markers,
    map: mapRef.current,
    algorithm: new SuperClusterAlgorithm({ radius: 200 }),
  });

  return () => {
    mc.clearMarkers();
  };
}, [markers]);
