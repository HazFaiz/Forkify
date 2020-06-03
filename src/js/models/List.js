import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = []; // when we create new items they will be pushed to this array
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    // We will use splice to delete. pass in start index and how many elements want to take. will return those and delete from array
    // [2,4,8] splice(1,1) => return 4, original array is [2,8]. last argument is how many to take. Will mutate original array
    // [2,4,8] slice(1,1) => return 4, original array is [2,4,8] Original array is not mutated. last argument in splice and slice are not the same
    const index = this.items.findIndex((el) => el.id === id);

    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount; //find the item with the id we pass in, and change its count to the newCount
  }
}
