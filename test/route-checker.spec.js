
import Graph from '../lib/graph';
import RouteChecker from '../lib/route-checker';

const libOptions = {
  locations: { 
    A: { x: '4945.6970', y: '03632.2106', to: [{ node: 'B', weight: 10 }] },
    B: { x: '4945.7250', y: '03632.2400', to: [{ node: 'C', weight: 15 }] },
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

const expectedOpts = {
  nmeaXIndex: 2,
  nmeaYIndex: 4,
}

const expectedSystemRoute = {
  '4945.6970:03632.2106': ['4945.7250:03632.2400'],
  '4945.7250:03632.2400': ['4945.9000:03632.5347'],
  '4945.9000:03632.5347': [],
}

describe("Route checker: ", () => {

  it("should init lib with empty options", () => {
    const lib = new RouteChecker();

    const options = lib.getOptions();
    const systemRoute = lib.getSystemRoute();
    const actualRoute = lib.getActualRoute();

    expect(lib).toBeInstanceOf(RouteChecker);
    expect(options).toMatchObject(expectedOpts);

    expect(lib.systemRoute).toBeInstanceOf(Graph);
    expect(lib.actualRoute).toBeInstanceOf(Graph);

    expect(systemRoute.size).toBe(0);
    expect(actualRoute.size).toBe(0);
  })

  it("should init data", () => {
    const lib = new RouteChecker(libOptions);

    const systemRoute = lib.getSystemRoute();
    const actualRoute = lib.getActualRoute();

    expect(lib).toBeInstanceOf(RouteChecker);
    expect(lib.getOptions()).toMatchObject(expectedOpts);
    expect(lib.systemRoute).toBeInstanceOf(Graph);
    expect(lib.actualRoute).toBeInstanceOf(Graph);

    expect(systemRoute.size).toBe(3);         
    expect(systemRoute.get('4945.6970:03632.2106').map(s => s.node))
      .toEqual(expect.arrayContaining(expectedSystemRoute['4945.6970:03632.2106']));
    expect(systemRoute.get('4945.7250:03632.2400').map(s => s.node))
      .toEqual(expect.arrayContaining(expectedSystemRoute['4945.7250:03632.2400']));
    expect(systemRoute.get('4945.9000:03632.5347').map(s => s.node))
      .toEqual(expect.arrayContaining(expectedSystemRoute['4945.9000:03632.5347']));

    expect(actualRoute.size).toBe(3);         
    expect(actualRoute.get('4945.6970:03632.2106').map(s => s.node))
      .toEqual(expect.arrayContaining(expectedSystemRoute['4945.6970:03632.2106']));
    expect(actualRoute.get('4945.7250:03632.2400').map(s => s.node))
      .toEqual(expect.arrayContaining(expectedSystemRoute['4945.7250:03632.2400']));
    expect(actualRoute.get('4945.9000:03632.5347').map(s => s.node))
      .toEqual(expect.arrayContaining(expectedSystemRoute['4945.9000:03632.5347']));
  })

  it("should return empty result when comparing valid routes", () => {
    const lib = new RouteChecker(libOptions);
    const result = lib.compareRoutes();

    expect(result).toBeFalsy();
  })

  it("should return routes which are invalid", () => {
    const nmea = [
      '0GPGGA,061460.00,4945.6970,N,03632.2106,E,1,04,12.6,0.0,M,16.1,M,,*53', // A
      '0GPGGA,061460.00,4945.9000,N,03632.5347,E,1,04,12.6,0.0,M,16.1,M,,*53', // C
    ]
    const lib = new RouteChecker({...libOptions, nmea});
    const result = lib.compareRoutes();

    expect(result).toBe('4945.6970:03632.2106;4945.7250:03632.2400;');
  })

  it("should return shortest path from A to C (A->D->C) for system route", () => {
    const locations = { 
      A: { x: '4945.6970', y: '03632.2106', to: [{ node: 'B', weight: 1 }, { node: 'D', weight: 2 }] },
      B: { x: '4945.7250', y: '03632.2400', to: [{ node: 'C', weight: 8 }] },
      C: { x: '4945.9000', y: '03632.5347', to: [] },
      D: { x: '4946.2346', y: '03680.5298', to: [{ node: 'C', weight: 3 }] },
    }
    const lib = new RouteChecker({...libOptions, locations});
    const result = lib.findSystemShortestPath('4945.6970:03632.2106', '4945.9000:03632.5347');

    expect(result.toExist);
    expect(result.path)
      .toEqual(expect.arrayContaining(['4945.6970:03632.2106', '4946.2346:03680.5298', '4945.9000:03632.5347']));
    expect(result.weight).toEqual(5);
  })

})