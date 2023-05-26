import { useGeneralSettings } from '@/components/settings/general-settings.js';
// import * as tf from '@tensorflow/tfjs';


export const useSimilarityVectors = () => {
  // Load General UI settings
  const { 
    debug_verbose,
    loadGeneralSettings
  } = useGeneralSettings();
  loadGeneralSettings();

  /** Hamming Distance */
  const hamming_similarity = (hash1, hash2) => {
    let matches = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] === hash2[i]) {
        matches++;
      }
    }
    return matches / hash1.length;
  }

  /** Compute Similarity Vectors */
  const computeSimilaries = async (pool) => {
    if(debug_verbose.value){
      console.group();
      console.log("Compute similarity vectors for all examples in the pool")
      console.time('Elapsed time');
    }
    // init storage
    Object.keys(pool).forEach((key) => {
      if(pool[key]['similarities'] === undefined) {
        pool[key]['similarities'] = {
          "semantic": {}, "grammar": {}, "duplicate": {}, "biblio": {}}
      }
    });
    // compute similarities if not exits
    let numPairs = 0;
    const computeOneExample = (key1, key2) => {
      if(key1 !== key2){
        if(pool[key1]['similarities']['semantic'][key2] === undefined) {
          pool[key1]['similarities']['semantic'][key2] = hamming_similarity(
            pool[key1]['hashes']['semantic'], pool[key2]['hashes']['semantic']);
            pool[key2]['similarities']['semantic'][key1] = pool[key1]['similarities']['semantic'][key2] 
        }
        if(pool[key1]['similarities']['grammar'][key2] === undefined) {
          pool[key1]['similarities']['grammar'][key2] = hamming_similarity(
            pool[key1]['hashes']['grammar'], pool[key2]['hashes']['grammar']);
            pool[key2]['similarities']['grammar'][key1] = pool[key1]['similarities']['grammar'][key2] 
        }
        if(pool[key1]['similarities']['duplicate'][key2] === undefined) {
          pool[key1]['similarities']['duplicate'][key2] = hamming_similarity(
            pool[key1]['hashes']['duplicate'], pool[key2]['hashes']['duplicate']);
            pool[key2]['similarities']['duplicate'][key1] = pool[key1]['similarities']['duplicate'][key2] 
        }
        if(pool[key1]['similarities']['biblio'][key2] === undefined) {
          pool[key1]['similarities']['biblio'][key2] = hamming_similarity(
            pool[key1]['hashes']['biblio'], pool[key2]['hashes']['biblio']);
            pool[key2]['similarities']['biblio'][key1] = pool[key1]['similarities']['biblio'][key2] 
        }
        numPairs++;
      }
    };

    let allPromises = [];
    Object.keys(pool).forEach((key1) => {
      Object.keys(pool).forEach((key2) => {
        allPromises.push(computeOneExample(key1, key2));
      });
    });
    await Promise.all(allPromises)

    if(debug_verbose.value){
      console.log(`Pairs computed: ${numPairs}`)
      console.timeEnd('Elapsed time');
      console.groupEnd();
    }

  }

  return {
    computeSimilaries,
    hamming_similarity
  }
}