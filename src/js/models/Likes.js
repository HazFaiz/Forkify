export default class Likes {
  constructor() {
    this.likes = []; // Similar to list class, we init using empty array
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // Each time likes array is changed, persist the data
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex((el) => el.id === id);

    this.likes.splice(index, 1);

    // Each time likes array is changed, persist the data
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1; //if we cannot find any item with the passed id, then itll be -1. aka not liked. If its not -1, then the like exists
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes)); // HAVE TO save strings. so save the array as strings
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes")); // Is a string, have to convert bback to array
    if (storage) this.likes = storage; //restoring our likes from storage
  }
}
