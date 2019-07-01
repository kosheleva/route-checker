
import Graph from './../graph';
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

const expectedOpts = {
  nmeaXIndex: 2,
  nmeaYIndex: 4,
  formattedNmeaXIndex: 3,
  formattedNmeaYIndex: 5,
  nodeCoordsIndex: 1,
  nmeaNodeIndex: 0,
}

const expectedSystemRoute = {
  'A_4945.6970:03632.2106': ['B'],
  'B_4945.7250:03632.2400': ['C'],
  'C_4945.9000:03632.5347': []
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
    expect(systemRoute.get('A_4945.6970:03632.2106'))
      .toEqual(expect.arrayContaining(expectedSystemRoute['A_4945.6970:03632.2106']));
    expect(systemRoute.get('B_4945.7250:03632.2400'))
      .toEqual(expect.arrayContaining(expectedSystemRoute['B_4945.7250:03632.2400']));
    expect(systemRoute.get('C_4945.9000:03632.5347'))
      .toEqual(expect.arrayContaining(expectedSystemRoute['C_4945.9000:03632.5347']));

    expect(actualRoute.size).toBe(3);         
    expect(actualRoute.get('A_4945.6970:03632.2106'))
      .toEqual(expect.arrayContaining(expectedSystemRoute['A_4945.6970:03632.2106']));
    expect(actualRoute.get('B_4945.7250:03632.2400'))
      .toEqual(expect.arrayContaining(expectedSystemRoute['B_4945.7250:03632.2400']));
    expect(actualRoute.get('C_4945.9000:03632.5347'))
      .toEqual(expect.arrayContaining(expectedSystemRoute['C_4945.9000:03632.5347']));
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

    expect(result).toBe('A_4945.6970:03632.2106;B_4945.7250:03632.2400;');
  })

})