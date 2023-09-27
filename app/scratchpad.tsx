// function PlaceDetail(id: string = placeId) {

//   const overlayLayoutRef = React.useRef(null);

//   return (
//     <>
//       <GMPX.OverlayLayout ref={overlayLayoutRef} slot="fixed">
//         <div className="MainContainer" slot="main">

//           <GMPX.PlaceOverview
//             size="large"
//             place={placeId}
//             googleLogoAlreadyDisplayed
//           >
//             <GMPX.IconButton
//               slot="action"
//               variant="filled"
//               onClick={() => overlayLayoutRef.current?.showOverlay()}
//             >
//               See Reviews
//             </GMPX.IconButton>
//             <GMPX.PlaceDirectionsButton slot="action" variant="filled">
//               Directions
//             </GMPX.PlaceDirectionsButton>
//           </GMPX.PlaceOverview>
//         </div>
//         <div slot="overlay">
//           <GMPX.IconButton
//             autofocus
//             className="CloseButton"
//             onClick={() => overlayLayoutRef.current?.hideOverlay()}
//           >
//             Close
//           </GMPX.IconButton>
//           <GMPX.PlaceDataProvider place={placeId}>
//             <GMPX.PlaceReviews />
//           </GMPX.PlaceDataProvider>
//         </div>
//       </GMPX.OverlayLayout>
//     </>
//   );
// }

// export default PlaceDetail;


{/* <p className="text-sm leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
{item[title]}
</p>
<p className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400">
{item[description]}
</p> */}