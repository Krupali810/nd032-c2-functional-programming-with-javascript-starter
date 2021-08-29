let store = {
  user: { name: "User" },
  roverInfo: "",
  roverInfoMap: {},
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  selectedRover: "Curiosity".toLowerCase(),
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = ({ rovers, roverInfo, selectedRover }) =>
  `
          <header></header>
          <main>
            <div style={{alignContent:"center"}}>
              ${Greeting(store.user.name)}
            </div>
              <div style="width:100%; margin:0 auto;">
                <nav>
                  ${roverNavTabs(rovers)}
                </nav>
              </div>
              <section>
                <h1>Viewing ${store.selectedRover.toUpperCase()} Rover Photos</h1>
              </section>
              <section>
                  ${roverInformation(selectedRover, roverInfo)}
              </section>
          </main>
          <footer></footer>
      `;

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

const Greeting = (name) => {
  if (name) {
    return `
              <h1>Welcome, ${name}!</h1>
          `;
  }
  return `
          <h1>Hello!</h1>
      `;
};

const roverNavTabs = (rovers) => {
  console.log(`rovers`, rovers.toJS());
  return rovers.toJS().map((roverName) => createLinks(roverName));
};

const createLinks = (roverName) => {
  return `
    <button id=${roverName} type="button" class="btn btn-secondary" onClick="selectRover(id)">
      ${roverName}
    </button>
  `;
};

const roverLinks = (rovers) =>
  rovers.map((roverName) => createNavLinks(roverName));

const createNavLinks = (roverName) => {
  return `
  <li class="nav-item" onClick="selectRover(id)">
    <a class="nav-link" >${roverName}</a>
  </li>
  `;
};

const createButton = (roverName) => {
  return `
    <button id=${roverName} onClick="selectRover(id)">
      ${roverName}
    </button>
  `;
};

function selectRover(roverName) {
  updateStore(store, { selectedRover: roverName.toLowerCase() });
}

const roverInformation = (rover, roverInfo) => {
  console.log(`rover store info`, store.roverInfoMap);
  const isRoverInfoPresent = Object.keys(store.roverInfoMap).find(
    (key) => key === store.selectedRover
  );
  if (!isRoverInfoPresent) {
    getDataFromAPI("roverImageInfo");
  }
  if (store.roverInfoMap && store.roverInfoMap[rover]) {
    const roverDataArray =
      store.roverInfoMap[rover]["roverPhotoReponse"]["photos"];
    if (roverDataArray) {
      const roverPhotoArray = roverDataArray.map((val) => val["img_src"]);
      return displayRoverPhotoGrid(roverPhotoArray);
    }
  }
  return `<div/>`;
};

const createImage = (imgSrc) => {
  return `
    <img src=${imgSrc} height="350px" width="30%"/>
 `;
};

const displayRoverPhotoGrid = (photosArray) => {
  const divForPhotosArray = photosArray.map((val) => createImage(val));

  return divForPhotosArray;
};

const test = () => {};

const getDataFromAPI = (url) => {
  let roverName = store.selectedRover;
  if (url === "roverImageInfo") {
    fetch(`http://localhost:3000/${url}/${roverName}`)
      .then((res) => res.json())
      .then((roverInfo) => {
        console.log(`roverInfo is`, roverInfo);
        updateStore(store, {
          roverInfoMap: {
            ...store.roverInfoMap,
            [`${roverName}`]: roverInfo,
          },
        });
      })
      .catch((err) => console.log(err));
  }
};
