/**
 * Convert string to array
 * 
 * @returns {Array}
 */
const toArray = (row) => {
  return row.split(',');
}

/**
 * Format system route node as '<x_coordinate>:<y_coordinate>'
 * 
 * @returns {String}
 */
module.exports.formatSystemNode = ({ data }) => {
  return `${data.x}:${data.y}`;
}


/**
 * Format nmea node as '<x_coordinate>:<y_coordinate>'
 * 
 * @returns {String}
 */
module.exports.formatNmeaNode = ({ row, options }) => {
  const { nmeaXIndex, nmeaYIndex } = options;
  const rowAsArray = toArray(row);

  return `${rowAsArray[nmeaXIndex]}:${rowAsArray[nmeaYIndex]}`;
}
