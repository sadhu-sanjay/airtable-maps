

export function createMapControl(icon: string, onClick: () => void) {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("div");
    const controlImg = document.createElement("img");

    controlDiv.appendChild(controlUI);
    controlUI.appendChild(controlImg);

    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";

    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginLeft = "10px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Zoom out completely";
    controlImg.src = icon;
    controlImg.style.width = "36px";
    controlImg.style.height = "36px";

    controlUI.addEventListener("click", onClick);

    return controlDiv;
}


