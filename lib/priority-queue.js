
import { sortBy } from './utils';

class PriorityQueue {

  constructor() {
    this.collection = [];
  }

  add(element) {
    this.collection.push(element);
    this.prioritize();
  };

  remove() {
    return this.collection.shift();
  };

  prioritize() {
    this.collection.sort((a, b) => sortBy(a, b, 'weight'));
  };

  isEmpty() {
    return !this.collection.length;
  };
}

module.exports = PriorityQueue;