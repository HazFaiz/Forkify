import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightsSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });

  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>    
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup); // Will insert the markup we just generated above into the DOM
}; // private function, no need to export it

//'Pasta with tomato and spinach
/* 
acc: 0 / acc + cur.length = 5 /// newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 /// newTitle = ['Pasta' 'with']
acc: 9 / acc + cur.length = 15 /// newTitle = ['Pasta' 'with' 'tomato']
acc: 15 / acc + cur.length = 18 /// newTitle = ['Pasta' 'with' 'tomato']


*/

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    //take title, split it by space. use reduce
    //if acc and current wword length still below limit, push the word into new array.
    //update acc
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    //return the result with ...
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

// type can be `previous` or `next`
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
    </button>  
`;

const renderButtons = (page, numResults, resPerPage) => {
  // if not on first and last page, show both buttons. if page 1, show next, if last page, show previous, etc

  // We find out how many pages there are by % number of results by the resPerPage.
  const pages = Math.ceil(numResults / resPerPage); // 30/10 will be 3 pages. Use Math.ceil if we get 4.5 pages, we will round it up to 5 pages

  let button; // declare button outside so we can modify it outside

  if (page === 1 && pages > 1) {
    //Only Button to go to next page if on page 1 and there are more pages
    button = createButton(page, "next");
  } else if (page < pages) {
    // middle pages with both buttons
    button = `
    ${createButton(page, "next")}
    ${createButton(page, "prev")}
    `; // we want both buttons so we use template string
  } else if (page === pages) {
    // Last page is = pages. If we have 5 pages and we're on page 5, that means we're in the last page already// Only button to go to previous page
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button); // Insert the button
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //remder results of current page
  const start = (page - 1) * resPerPage; //on page 1, its element 0, on page two itll be element 10
  const end = page * resPerPage; // on page 1, its 10. slice will only copy from 0 to 9, not including last number
  recipes.slice(start, end).forEach(renderRecipe); // no need to do () since its a callback // we limit the number of results shown accordingingly using slice

  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
