
export const useSimilarityVectors = () => {

  /** Hamming Distance */
  const hamming_distance = (hash1, hash2) => {
    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) {
        distance++;
      }
    }
    return distance / hash1.length;
  }


  /** Compute Similarity Vectors */
  const computeSimilaries = async (pool) => {
    // init storage
    Object.keys(pool).forEach((key) => {
      if(pool[key]['similarities'] === undefined) {
        pool[key]['similarities'] = {
          "semantic": {}, "grammar": {}, "duplicate": {}, "biblio": {}}
      }
    });
    // compute similarities if not exits
    Object.keys(pool).forEach((key1) => {
      Object.keys(pool).forEach((key2) => {
        if(key1 !== key2){
          if(pool[key1]['similarities']['semantic'][key2] === undefined) {
            pool[key1]['similarities']['semantic'][key2] = hamming_distance(
              pool[key1]['hashes']['semantic'], pool[key2]['hashes']['semantic']);
              pool[key2]['similarities']['semantic'][key1] = pool[key1]['similarities']['semantic'][key2] 
          }
          if(pool[key1]['similarities']['grammar'][key2] === undefined) {
            pool[key1]['similarities']['grammar'][key2] = hamming_distance(
              pool[key1]['hashes']['grammar'], pool[key2]['hashes']['grammar']);
              pool[key2]['similarities']['grammar'][key1] = pool[key1]['similarities']['grammar'][key2] 
          }
          if(pool[key1]['similarities']['duplicate'][key2] === undefined) {
            pool[key1]['similarities']['duplicate'][key2] = hamming_distance(
              pool[key1]['hashes']['duplicate'], pool[key2]['hashes']['duplicate']);
              pool[key2]['similarities']['duplicate'][key1] = pool[key1]['similarities']['duplicate'][key2] 
          }
          if(pool[key1]['similarities']['biblio'][key2] === undefined) {
            pool[key1]['similarities']['biblio'][key2] = hamming_distance(
              pool[key1]['hashes']['biblio'], pool[key2]['hashes']['biblio']);
              pool[key2]['similarities']['biblio'][key1] = pool[key1]['similarities']['biblio'][key2] 
          }
        }
      });
    });
  }

  return {
    computeSimilaries,
    hamming_distance
  }
}