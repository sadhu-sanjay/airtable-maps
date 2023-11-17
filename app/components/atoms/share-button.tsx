const share_img = "/share.svg";

export function ShareButton(onClickHandler: () => void) {
  const controlDiv = document.createElement("button");
  const controlUI = document.createElement("div");
  const controlImg = document.createElement("img");

  controlDiv.appendChild(controlUI);
  controlUI.appendChild(controlImg);

  controlUI.style.backgroundColor = "#fff";
  controlDiv.addEventListener("click", () => {
    controlUI.style.backgroundColor = "#eee";
    setTimeout(() => {
      controlUI.style.backgroundColor = "#fff";
      // controlUI.style.backgroundColor = "#fff";
    }, 1500);
    onClickHandler();
  });
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "2px";
  controlUI.style.boxShadow = "rgba(0, 0, 0, 0.3) 0px 1px 4px -1px";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginTop = "10px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Copy sharable link of this map";
  controlUI.style.width = "40px";
  controlUI.style.height = "40px";
  controlUI.style.display = "flex";
  controlUI.style.justifyContent = "center";
  controlUI.style.alignItems = "center";

  controlImg.src = share_img;
  controlImg.style.width = "28px";
  controlImg.style.height = "28px";

  return controlDiv;
}
