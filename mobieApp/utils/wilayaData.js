import wilayaCommunesData from '../data/wilaya_communes.json';

/**
 * Get list of all wilayas (provinces)
 * @returns {Array<string>} Array of wilaya names
 */
export const getWilayas = () => {
  return Object.keys(wilayaCommunesData).sort();
};

/**
 * Get list of communes for a specific wilaya
 * @param {string} wilaya - The wilaya name
 * @returns {Array<string>} Array of commune names, or empty array if wilaya not found
 */
export const getCommunesByWilaya = (wilaya) => {
  if (!wilaya || !wilayaCommunesData[wilaya]) {
    return [];
  }
  return wilayaCommunesData[wilaya].sort();
};

/**
 * Check if a wilaya exists
 * @param {string} wilaya - The wilaya name
 * @returns {boolean}
 */
export const wilayaExists = (wilaya) => {
  return !!wilayaCommunesData[wilaya];
};

/**
 * Get total number of wilayas
 * @returns {number}
 */
export const getWilayaCount = () => {
  return Object.keys(wilayaCommunesData).length;
};

export default wilayaCommunesData;

