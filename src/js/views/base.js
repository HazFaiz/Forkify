// Put all dom Elements here for easier tracking when markup is changed

// Also put reusable elements/styles here, like loaders

export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultList: document.querySelector(".results__list"),
  searchRes: document.querySelector(".results"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
};

export const elementStrings = {
  loader: `loader`,
};

export const renderLoader = (parent) => {
  // we attach this loader as the child of this parent. can attach anywhere
  const loader = `
        <div class="${elementStrings.loader}">
            <svg>
            <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  //in order to remove element, have to move up to parent then remove the child
  if (loader) loader.parentElement.removeChild(loader);
};
