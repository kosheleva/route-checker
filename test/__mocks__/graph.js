class Graph {
    constructor(nodesCount) {
      this.nodesCount = nodesCount;
      this.data = new Map();
    }
  
    addNode(node) {
      this.data.set(node, []);
    }
  
    addEdge(node, edge) {
      this.data.get(node).push(edge);
      this.data.get(edge).push(node);
    }
  
    getData() {
      return this.data;
    }
  }
  
  module.exports = Graph;