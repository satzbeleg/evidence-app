/**
 * Sources:
 * --------
 *  https://stackoverflow.com/a/44911097
 */
export const removeEmptyKeys = (a) => {
  return JSON.parse(JSON.stringify(a), (k, v) => {
    return (v === null // delete null values
        ||
        (Array.isArray(v) && v.length === 0) // delete empty arrays
        ||
        (typeof v === 'object' && Object.keys(v).length === 0)) // delete empty objects
      ?
      undefined : v // else return the value
  });
}

/**
 * EXAMPLES
 * --------
 *  import { traverseObject } from '@/functions/traverse-objects.js';
 *  console.log(traverseObject(window.navigator, 1));
 *  console.log(traverseObject(window.screen, 1));
 *  console.log(traverseObject(window, 0));
 */
export const traverseObject = (xin, maxlevel, currlevel = 0) => {
  if (currlevel > maxlevel) {
    return {}
  }
  var obj = {}
  for (var key in xin) {
    if (typeof xin[key] != "function") {
      if (typeof xin[key] == "object") {
        obj[key] = traverseObject(xin[key], maxlevel, currlevel + 1);
      } else if (typeof xin[key] != "undefined") {
        if (xin[key] !== "") {
          obj[key] = xin[key];
        }
      }
    }
  }
  return removeEmptyKeys(obj);
}