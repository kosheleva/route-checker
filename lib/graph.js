
import PriorityQueue from './priority-queue';

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

  findShortestPath(startNode, endNode) {
    let weight = {};
    let backtrace = {};
    let pq = new PriorityQueue();

    const data = this.getData();

    // define initial weights
    data.forEach((node, key) => { weight[key] = Infinity });
    weight[startNode] = 0;
    
    pq.add({ node: startNode, weight: 0 });

    // calculate path
    while (!pq.isEmpty()) {
      let shortestStep = pq.remove();
      let currentNode = shortestStep.node;
      
      data.get(currentNode).forEach(neighbor => {
        let w = weight[currentNode] + neighbor.weight;

        if (w < weight[neighbor.node]) {
          weight[neighbor.node] = w;
          backtrace[neighbor.node] = currentNode;
          pq.add({ node: neighbor.node, weight: w });
        }
      });
    }

    let path = [endNode];
    let lastStep = endNode;

    // define output
    while(lastStep !== startNode) {
      path.unshift(backtrace[lastStep])
      lastStep = backtrace[lastStep]
    }
    
    return {
      path,
      weight: weight[endNode],
    }
  }
}

module.exports = Graph;