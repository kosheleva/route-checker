class Graph {
  constructor(nodesCount) {
    this.nodesCount = nodesCount;
    this.data = new Map();
  }

  addNode(node) {
    this.data.set(node, []);
  }

  addEdge(node, edge, weight) {
    this.data.get(node).push({ node: edge, weight });
  }

  getData() {
    return this.data;
  }
}

module.exports = Graph;