# Route checker

The purpose of this library is playing with algorithms and data structures, investigating performance impact.

Assuming we have a vehicle, predefined system routes for it

_A->B->C and A->D->C_

where A, B, C, D - places to visit,

and NMEA data as actual route

_0GPGGA,061455.00,4945.6952,N,03632.2096,E,1,04,12.6,0.0,M,16.1,M,,*53_,

we can do the following:

* __to check if movement was by predefined route, e.g__

   _system route is: move from A to C via B (A->B->C)_

   _actual route is A->B->C: correct_

   _actual route is A->C or D->C: wrong_


* __to find the shortest path between two places in system route, e.g__

  _From A to B 1km_

  _From A to D 2km_

  _From B to C 8km_

  _From D to C 3km_

  _The shortest path is from A to C via D - 5km._
