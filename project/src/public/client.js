let store = {
  user: { name: "Student" },
  roverInfo: "",
  roverInfoMap: {},
  rovers: ["Curiosity", "Opportunity", "Spirit"],
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
              ${Greeting(store.user.name)}
              <section>
                <nav>
                  ${roverNavTabs(rovers)}
                </nav>
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

const roverNavTabs = (rovers) =>
  rovers.map(
    (roverName) => `
    <button id=${roverName} onClick="selectRover(id)">
      ${roverName}
    </button>
  `
  );

function selectRover(roverName) {
  updateStore(store, { selectedRover: roverName.toLowerCase() });
}

const roverInformation = (rover, roverInfo) => {
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

const displayRoverPhotoGrid = (photosArray) => {
  const divForPhotosArray = photosArray.map(
    (val) => `<img src=${val} height="350px" width="30%"/>`
  );

  return divForPhotosArray;
};

const getDataFromAPI = (url) => {
  let roverName = store.selectedRover;
  if (url === "roverImageInfo") {
    fetch(`http://localhost:3000/${url}/${roverName}`)
      .then((res) => res.json())
      .then((roverInfo) => {
        updateStore(store, {
          roverInfoMap: { ...store.roverInfoMap, [`${roverName}`]: roverInfo },
        });
      })
      .catch((err) => console.log(err));
  }
};
