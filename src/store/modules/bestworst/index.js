import unlabeled from "./unlabeled";
import current from "./current";
import ranked from "./ranked";

export default {
  namespaced: true,
  modules: {
    unlabeled: unlabeled,  // queue to load new unlabelled example sets from API
    current: current,      // the current example set that have been taken out for annotation 
    ranked: ranked,        // queue with annotated example sets ready to send to API
  }
}