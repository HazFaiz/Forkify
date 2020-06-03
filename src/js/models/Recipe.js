import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
      this.url = res.data.recipe.source_url;
      //console.log(res);
    } catch (error) {
      alert(error);
    }
  }

  calcTime() {
    // rough estimate, for every 3 ingredients the cook time is 15 minutes
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4; // Hardcode 4 servings on each recipe
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...unitsShort, "kg", "g"];
    const newIngredients = this.ingredients.map((el) => {
      // 1) Uniform Units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]); // loop over each long unit possibility and change it with the short units in the same position. tablespoons will change with tbsp
      });

      // 2) Remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); //use regex to remove the parents. store in new variable since replace doesnt change the original variable, it returns a new one

      // 3) Parse ingredients into count, unit and ingredient
      // Test if there is a unit in the string and check where its located. Convert the ingredient into an array
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2)); //Find index of the unit. includes returns true if the el we pass is in the array // GREAT TRICK TO FIND POSITION OF UNIT WHEN WE DONT KNOW WHAT UNIT WE ARE LOOKING FOR

      let objIng;
      if (unitIndex > -1) {
        // There is a unit // if the unit exists in the array
        // Ex. 4 1/2 cups, arrCount is [4,1/2]
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+")); //Covers "1-1/2 cups"
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+")); // Ex. 4 1/2 cups, arrCount is [4,1/2] -> "4+1/2" -> 4.5
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is NO unit BUT 1st element is a number. We convert it into a number, if it actually is a number, then it returns true, else false
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        //There is NO unit AND NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng; // in each iteration of .map, we HAVE to return
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    // console.log(`updateservings is working`);
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1; // Will not update this.servings right away, for now we store into a variable first

    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings); //New servings of 3, old servings of 4, and count of 1. so 1 * 3/4 = 3/4
    });

    this.servings = newServings;
  }
}

//getRecipe
