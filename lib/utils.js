/**
 * Convert string to array
 * 
 * @param {String} row
 * 
 * @returns {Array}
 */
const toArray = (row) => {
  return row.split(',');
}

/**
 * Format system route node as '<x_coordinate>:<y_coordinate>'
 * 
 * @param {Object} data
 * 
 * @returns {String}
 */
module.exports.formatSystemNode = ({ data }) => {
  return `${data.x}:${data.y}`;
}


/**
 * Format nmea node as '<x_coordinate>:<y_coordinate>'
 * 
 * @param {Object} data
 * 
 * @returns {String}
 */
module.exports.formatNmeaNode = ({ row, options }) => {
  const { nmeaXIndex, nmeaYIndex } = options;
  const rowAsArray = toArray(row);

  return `${rowAsArray[nmeaXIndex]}:${rowAsArray[nmeaYIndex]}`;
}

/**
 * Sort array of objects by specified field
 * 
 * @returns {Number}
 */
module.exports.sortBy = ( a, b, field ) => {
  if ( a[field] < b[field] ) {
    return -1;
  }
  if ( a[field] > b[field] ) {
    return 1;
  }
  return 0;
}
