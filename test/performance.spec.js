
import RouteChecker from './../route-checker';

const initializationTimeLimit = 100; // ms

const locationsCount = 10000;
const nmeaCount = 20000;
const nmeaShift = 2000;

const generateLocations = () => {
  const locations = {};
  for (let i = 0; i < locationsCount; i++) {
    locations[i] = {
      x: i,
      y: i,
      to: [{ node: i + 1, weight: Math.round(Math.random() * 10) || 1 }],
    }
  }

  return locations;
}

const generateNmea = () => {
  const nmea = [];
  for (let i = nmeaShift; i < nmeaCount; i++) {
    nmea.push(`0GPGGA,061455.00,${i},N,${i},E,1,04,12.6,0.0,M,16.1,M,,*53`);
  }

  return nmea;
}

describe("Route checker: ", () => {

  it("should init lib", () => {
    const options = {
      locations: generateLocations(),
      nmea: generateNmea(),
    }
   
    const t0 = performance.now();
    const lib = new RouteChecker(options);
    const t1 = performance.now();

    expect(t1 - t0).toBeLessThan(initializationTimeLimit);

    const systemRoute = lib.getSystemRoute();
    const actualRoute = lib.getActualRoute();

    expect(systemRoute.size).toBe(locationsCount);
    expect(actualRoute.size).toBe(locationsCount - nmeaShift);
  })

})