let store = Immutable.Map({
  user: { name: "User" },
  roverInfo: "",
  roverInfoMap: {},
  rovers: ["Curiosity", "Opportunity", "Spirit"],
  selectedRover: "Curiosity".toLowerCase(),
});

const root = document.getElementById("root");

const render = async (root, store) => {
  root.innerHTML = App(store);
};

const App = (store) =>
  `
          <div>
          <div style="width:100%; text-align: center; margin:0 auto;">
          ${Greeting(fetchGreetingText())}
            </div>
              <div style="width:100%; text-align: center; margin:0 auto;">
                <nav>
                  ${roverNavTabs(store.toJS().rovers)}
                </nav>
              </div>
              <div style="width:100%; text-align: center; margin:0 auto;">
                <h2>Viewing ${store
                  .toJS()
                  .selectedRover.toUpperCase()} Rover Photos</h2>
              </div>
              <div class="container">
                ${roverInformation(store.toJS().selectedRover)}
              </div>
          </div>
      `;

window.addEventListener("load", () => {
  render(root, store);
});

const Greeting = (fetchGreetingText) => {
  return `<h3>${fetchGreetingText}</h3>`;
};

function fetchGreetingText() {
  if (store.toJS().user.name) {
    return "Hello! " + store.toJS().user.name;
  }
  return "Hello!";
}

const roverNavTabs = (rovers) => {
  return rovers.map((roverName) => createLinks(roverName));
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
  updateStore("selectedRover", roverName.toLowerCase());
}

const roverInformation = (rover) => {
  const isRoverInfoPresent = Object.keys(store.toJS().roverInfoMap).find(
    (key) => key === store.toJS().selectedRover
  );
  if (!isRoverInfoPresent) {
    getDataFromAPI("roverImageInfo");
  }
  return displayRoverPhotoGrid(roverDataArrayInformation(rover));
};

const roverDataArrayInformation = (rover) => {
  if (store.toJS().roverInfoMap && store.toJS().roverInfoMap[rover]) {
    const roverDataArray =
      store.toJS().roverInfoMap[rover]["roverPhotoReponse"]["latest_photos"];
    if (roverDataArray) {
      return roverDataArray;
    }
    return [];
  }
  return [];
};

const displayRoverPhotoGrid = (roverDataArray) => {
  if (roverDataArray.length > 0) {
    const divForPhotosArray = roverDataArray.map((val) => {
      return createCard(val);
    });
    return divForPhotosArray;
  } else {
    return `<div/>`;
  }
};

const createCard = (roverData) => {
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
                <h6>Date the most recent photos were taken: ${roverData["earth_date"]}</h6>
                <h6>Landing Date: ${roverData["rover"]["landing_date"]}</h6>
                <h6>Launching Date: ${roverData["rover"]["launch_date"]}</h6>
              </span>
            </div>
          </div>
        </div>
      </div>
   `;
};

const updateStore = (key, value) => {
  if (key && !value) {
    throw new Error("Cannot update empty value");
  }
  let newStore = store.set(key, value);
  if (!newStore.equals(store)) {
    store = newStore;
  }
  render(root, store);
};

const getDataFromAPI = (url) => {
  const roverName = store.toJS().selectedRover;
  if (url === "roverImageInfo") {
    fetch(`http://localhost:3000/${url}/${roverName}`)
      .then((res) => res.json())
      .then((roverInfo) => {
        const newValueToSet = {
          ...store.get("roverInfoMap"),
          [`${roverName}`]: roverInfo,
        };
        console.log(`roverInfo from API`, roverInfo);
        updateStore("roverInfoMap", newValueToSet);
      })
      .catch((err) => console.log(err));
  }
};
