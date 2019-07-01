
import RouteChecker from './../route-checker';

const libOptions = {
  locations: { 
    A: { x: '4945.6970', y: '03632.2106', to: ['B'] },
    B: { x: '4945.7250', y: '03632.2400', to: ['C'] },
    C: { x: '4945.9000', y: '03632.5347', to: [] },
  },
  nmea: [
    '0GPGGA,061455.00,4945.6952,N,03632.2096,E,1,04,12.6,0.0,M,16.1,M,,*53',
    '0GPGGA,061460.00,4945.6970,N,03632.2106,E,1,04,12.6,0.0,M,16.1,M,,*53', // A
    '0GPGGA,061465.00,4995.6991,N,03632.2345,E,1,04,12.6,0.0,M,16.1,M,,*53',  
    '0GPGGA,061470.00,4945.7250,N,03632.2400,E,1,04,12.6,0.0,M,16.1,M,,*53', // B
    '0GPGGA,061475.00,4945.9000,N,03632.5347,E,1,04,12.6,0.0,M,16.1,M,,*53', // C
  ]
}

const generateLocations = () => {
  const locations = {};
  for (let i = 0; i < 10000; i++) {
    locations[i] = {
      x: i,
      y: i,
      to: [i+1],
    }
  }

  return locations;
}

const generateNmea = () => {
    const nmea = [];
    for (let i = 2000; i < 20000; i++) {
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

    // TODO:
    // console.log(t0, t1);  -- 5641.519719 202246.458097
    // expect(systemRoute.size).toBeLessThan(?);
  })

})