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
          <div>
          <div style="width:100%; text-align: center; margin:0 auto;">
          ${Greeting(store.user.name)}
            </div>
              <div style="width:100%; text-align: center; margin:0 auto;">
                <nav>
                  ${roverNavTabs(rovers)}
                </nav>
              </div>
              <div style="width:100%; text-align: center; margin:0 auto;">
                <h2>Viewing ${store.selectedRover.toUpperCase()} Rover Photos</h2>
              </div>
              <div class="container">
                ${roverInformation(selectedRover)}
              </div>
          </div>
      `;

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

const Greeting = (name) => {
  if (name) {
    return `
              <h2>Welcome ${name}!</h2>
          `;
  }
  return `
          <h2>Hello!</h2>
      `;
};

const roverNavTabs = (rovers) => {
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

const roverInformation = (rover) => {
  const isRoverInfoPresent = Object.keys(store.roverInfoMap).find(
    (key) => key === store.selectedRover
  );
  if (!isRoverInfoPresent) {
    getDataFromAPI("roverImageInfo");
  }
  if (store.roverInfoMap && store.roverInfoMap[rover]) {
    const roverDataArray =
      store.roverInfoMap[rover]["roverPhotoReponse"]["latest_photos"];
    if (roverDataArray) {
      return displayRoverPhotoGrid(roverDataArray);
    }
  }
  return `<div/>`;
};

const createCard = (roverData) => {
  console.log(`rover data`, roverData);
  return `
      <div class="card col-sm" style="width: 100%;  border: 3px solid gray">
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <img class="card-img-top" src=${roverData["img_src"]} height="350px"/>
            </div>
            <div class="col-sm" style="  margin: 0; position: relative; top: 50%; ">
              <span class="card-body">
                <h5>Status: ${roverData["rover"]["status"]}</h5>
                <h6>Date photo was captured: ${roverData["earth_date"]}</h6>
                <h6>Landing Date: ${roverData["rover"]["landing_date"]}</h6>
                <h6>Launching Date: ${roverData["rover"]["launch_date"]}</h6>
              </span>
            </div>
          </div>
        </div>
      </div>
   `;
};

const displayRoverPhotoGrid = (roverDataArray) => {
  const divForPhotosArray = roverDataArray.map((val) => createCard(val));
  return divForPhotosArray;
};

const test = () => {};

const getDataFromAPI = (url) => {
  let roverName = store.selectedRover;
  if (url === "roverImageInfo") {
    fetch(`http://localhost:3000/${url}/${roverName}`)
      .then((res) => res.json())
      .then((roverInfo) => {
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
