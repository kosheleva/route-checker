
import Graph from './graph';

class RouteChecker {
  /**
   * @param {Object} options
   * 
   * options = {
   *   locations: { A: { x: 4945.6952, y: 03632.2096, to: ['B', 'C'] } }
   *   nmea: [
   *     '0GPGGA,061455.00,4945.6952,N,03632.2096,E,1,04,12.6,0.0,M,16.1,M,,*53',
   *   ]
   * 
   * }
   */
  constructor(options = {}) {
    const { locations = {}, nmea = []} = options;

    this.options = this.initOptions();
    this.systemRoute = this.setSystemRoute(locations);
    this.actualRoute = this.setActualRoute(locations, nmea);
  }

  initOptions() {
    return {
      nmeaXIndex: 2,
      nmeaYIndex: 4,
      formattedNmeaXIndex: 3,
      formattedNmeaYIndex: 5,
      nodeCoordsIndex: 1,
      nmeaNodeIndex: 0,
    }
  }

  formatNode({ key, data }) {
    return `${key}_${data.x}:${data.y}`;
  }

  toArray(row) {
    return row.split(',');
  }

  getSystemRoute() {
    return this.systemRoute.getData();
  }

  getActualRoute() {
    return this.actualRoute.getData();
  }

  getOptions() {
    return this.options; 
  }

  /**
   * Build system route
   * 
   * @param {Array} locations { A: { x: 4945.6952, y: 03632.2096, to: ['B', 'C'] } }
   * 
   * @returns {Graph}
   */
  setSystemRoute(locations) {
    const locationsCount = Object.keys(locations).length;
    const systemRoute = new Graph(locationsCount);

    if (!locationsCount) {
      return systemRoute;
    }

    Object.keys(locations).forEach(location => {
      const node = this.formatNode({ key: location, data: locations[location] });
      systemRoute.addNode(node);

      locations[location].to.forEach(destination => {
        systemRoute.addEdge(node, destination);
      });
    });

    return systemRoute;
  }

  /**
   * Build route from nmea data
   * 
   * @param {Object} locations
   * @param {Array} nmea
   * 
   * @returns {Graph}
   */
  setActualRoute(locations, nmea) {
    const filteredNmea = this.parseNmea(locations, nmea);
    return this.buildNmeaRoute(filteredNmea);
  }

  /**
   * Parse nmea data
   * 
   * @param {Object} locations
   * @param {Array} nmea
   * 
   * @returns {Array} array of nmea rows which match system locations
   */
  parseNmea(locations, nmea) {
    return Object.keys(locations).map((location) => {
      const node = locations[location];
      const item = nmea.find((row) => {
        return this.matchLocations(row, node);
      });

      if (item) {
        return `${location}, ${item}`;
      }
    }).filter(item => item);
  }

  matchLocations(row, location) {
    const { nmeaXIndex, nmeaYIndex, nodeCoordsIndex } = this.getOptions();
    const rowAsArray = this.toArray(row);

    const nmeaXY = `${rowAsArray[nmeaXIndex]}:${rowAsArray[nmeaYIndex]}`;
    const locationXY = `${location.x}:${location.y}`;

    return nmeaXY === locationXY;
  }

  /**
   * @param {Array} filteredNmea
   * 
   * @returns Graph
   */
  buildNmeaRoute(filteredNmea) {
    const { nmeaNodeIndex, formattedNmeaXIndex, formattedNmeaYIndex } = this.getOptions();
    const count = filteredNmea.length;

    const actualRoute = new Graph(count);

    if (!count) {
      return actualRoute;
    }

    filteredNmea.forEach((row, index) => {
      const item = this.toArray(row);
      const formattedNode = this.formatNode({
        key: item[nmeaNodeIndex],
        data: {
          x: item[formattedNmeaXIndex],
          y: item[formattedNmeaYIndex],
        }
      });
      
      if (count === 1 || index === count - 1) {
        actualRoute.addNode(formattedNode);
        return;
      }
      actualRoute.addNode(formattedNode);

      const nextNode = this.toArray(filteredNmea[index + 1])[nmeaNodeIndex];
      actualRoute.addEdge(formattedNode, nextNode);
    });

    return actualRoute;
  }

  compareRoutes() {
    const systemLocations = this.getSystemRoute();
    const actualLocations = this.getActualRoute();

    let invalidRoutes = '';

    for (const [key, value] of systemLocations) {
      if (JSON.stringify(value) !== JSON.stringify(actualLocations.get(key)) ) {
        invalidRoutes += `${key};`;
      }
    }

    return invalidRoutes;
  }
}

module.exports = RouteChecker;