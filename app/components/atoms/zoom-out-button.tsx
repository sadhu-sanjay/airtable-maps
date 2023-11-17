const zoom_out_img = "/zoom-out-area.png";

export function ZoomOutButton(onClickHandler: () => void) {
  const controlDiv = document.createElement("button");
  const controlUI = document.createElement("div");
  const controlImg = document.createElement("img");

  controlDiv.appendChild(controlUI);
  controlUI.appendChild(controlImg);

  controlUI.style.backgroundColor = "#fff";
  controlUI.addEventListener("mouseenter", () => {
    controlUI.style.backgroundColor = "#eee";
  });
  controlUI.addEventListener("mouseleave", () => {
    controlUI.style.backgroundColor = "#fff";
  });
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginLeft = "10px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Zoom out completely";
  controlImg.src = zoom_out_img;
  controlUI.style.width = "40px";
  controlUI.style.height = "40px";
  controlUI.style.display = "flex";
  controlUI.style.justifyContent = "center";
  controlUI.style.alignItems = "center";
  controlImg.style.width = "32px";
  controlImg.style.height = "32px";

  controlDiv.addEventListener("click", () => onClickHandler());

  return controlDiv;
}

//   mapRef.current?.controls[window.google.maps.ControlPosition.LEFT_CENTER].push(
//     controlDiv
//   );
