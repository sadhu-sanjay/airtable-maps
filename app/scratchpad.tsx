// const filterHandler = useCallback(() => {
  //   searchArray.current = [];
  //   searchArray.current.push(
  //     ...selectedTags.current,
  //     ...selectedRegions.current
  //   );
  //   console.log("searchArray", searchArray.current);

  //   // let newFilteredRecords = records.filter((record) => {
  //   //   return searchArray.current.some((each) => {
  //   //     console.log("each", each);
  //   //     return record.searchStr?.includes(each);
  //   //   });
  //   // });
  //   const res = records.filter((record) => {
  //     {
  //       console.log("record", record.searchStr);
  //       return searchArray.current.some((each) => record.searchStr?.includes(each));
  //     }
  //   });
  //   console.log("newFilteredRecords", res.length);

  //   // if (newFilteredRecords.length === 0) return updateRecords(records);

  //   // updateRecords(newFilteredRecords);

  //   // console.log("newFilteredRecords", newFilteredRecords.length);
  // }, [records, updateRecords]);

  // const searchHandler = useCallback(
  //   (newSearchTerm: string) => {
  //     searchTerm.current = newSearchTerm;
  //     console.log("searchHandler", searchTerm.current);
  //     filterHandler();
  //   },
  //   [filterHandler]
  // );
  // const regionHandler = useCallback(
  //   (newRegionHandler: string[]) => {
  //     selectedRegions.current = newRegionHandler;
  //     console.log("regionHandler=>", selectedRegions.current);
  //     filterHandler();
  //   },
  //   [filterHandler]
  // );
  // const tagsHandler = useCallback(
  //   (newTagsHandler: string[]) => {
  //     selectedTags.current = newTagsHandler;
  //     console.log("tagHandler =>", selectedTags.current);
  //     filterHandler();
  //   },
  //   [filterHandler]
  // );