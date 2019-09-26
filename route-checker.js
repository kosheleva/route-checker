
import Graph from './graph';
import { formatSystemNode, formatNmeaNode } from './utils';

const DEFAULT_NMEA_WEIGTH = 1;
class RouteChecker {

  /**
   * @param {Object} options
   * 
   * options = {
   *   locations: { A: { x: 4945.6952, y: 03632.2096, to: [{ node: 'B', weight: 10 }, { node: 'C', weight: 20 }] } }
   *   nmea: [
   *     '0GPGGA,061455.00,4945.6952,N,03632.2096,E,1,04,12.6,0.0,M,16.1,M,,*53',
   *   ]
   * }
   */
  constructor(options = {}) {
    const { locations = {}, nmea = []} = options;

    this.options = this._initOptions();
    this.systemRoute = this._setSystemRoute(locations);
    this.actualRoute = this._setActualRoute(nmea);
  }

  /**
   * Define options
   * 
   * @returns {Object}
   */
  _initOptions() {
    return {
      nmeaXIndex: 2,
      nmeaYIndex: 4,
    }
  }

  /**
   * Get options
   * 
   * @returns {Object}
   */
  getOptions() {
    return this.options;
  }

  /**
   * Get system route data
   * 
   * @returns {Map}
   */
  getSystemRoute() {
    return this.systemRoute.getData();
  }

  /**
   * Get actual route data
   * 
   * @returns {Map}
   */
  getActualRoute() {
    return this.actualRoute.getData();
  }

  /**
   * Build system route
   * 
   * @param {Array} locations { A: { x: 4945.6952, y: 03632.2096, to: ['B', 'C'] } }
   * 
   * @returns {Graph}
   */
  _setSystemRoute(locations) {
    const locationsCount = Object.keys(locations).length;
    const systemRoute = new Graph(locationsCount);

    if (!locationsCount) {
      return systemRoute;
    }

    Object.keys(locations).forEach(location => {
      const node = formatSystemNode({ data: locations[location] });
      systemRoute.addNode(node);

      locations[location].to.forEach(destination => {
        if (locations[destination.node]) {
          systemRoute.addEdge(node, formatSystemNode({ data: locations[destination.node] }), destination.weight);
        }
      });
    });

    return systemRoute;
  }

  /**
   * Build system route
   * 
   * @param {Array} nmea
   * 
   * @returns {Graph}
   */
  _setActualRoute(nmea) {
    const filteredNmea = this._parseNmea(nmea);
    return this._buildNmeaRoute(filteredNmea);
  }

  /**
   * Filter nmea data set to leave only records which corresponds to system locations
   * 
   * @param {Array} nmea
   * 
   * @returns {Array}
   */
  _parseNmea(nmea) {
    const systemRoute = this.systemRoute.getData();

    return nmea.filter((row) => systemRoute.get(formatNmeaNode({ row, options: this.getOptions() })));
  }

  /**
   * Build nmea route
   * 
   * @param {Array} rows
   * 
   * @returns Graph
   */
  _buildNmeaRoute(rows) {
    const count = rows.length;
    const actualRoute = new Graph(count);

    if (!count) {
      return actualRoute;
    }

    rows.forEach((row, index) => {
      const isNoEdgeExist = count === 1 || index === count - 1;
      const formattedNode = formatNmeaNode({ row, options: this.getOptions() });
      
      actualRoute.addNode(formattedNode);

      if (isNoEdgeExist) {
        return row;
      }

      const nextNode = rows[index + 1];
      actualRoute.addEdge(formattedNode, formatNmeaNode({ row: nextNode, options: this.getOptions() }), DEFAULT_NMEA_WEIGTH);
    });

    return actualRoute;
  }

  /**
   * Checking if movement was by predefined system route
   * 
   * @returns {String} invalid routes
   */
  compareRoutes() {
    const systemLocations = this.getSystemRoute();
    const actualLocations = this.getActualRoute();

    let invalidRoutes = '';

    for (const [key, value] of systemLocations) {
      if (JSON.stringify((value || []).map(v => v.node)) !== JSON.stringify((actualLocations.get(key) || []).map(a => a.node)) ) {
        invalidRoutes += `${key};`;
      }
    }

    return invalidRoutes;
  }
}

module.exports = RouteChecker;