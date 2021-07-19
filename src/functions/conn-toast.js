/** 
 * Connectivity Detection and Bulma Toast notification 
 * 
 * Usage:
 * ------
 * Call the function in `App.vue` so that the connectivity is
 *  checked for all app views. 
 * 
 *  import useConnToast from '@/functions/conn-toast.js';
 *  export default {
 *    setup(){
 *      useConnToast();
 *    }
 *  }
 * 
 * Dependencies:
 * -------------
 *  - package.json: bulma-toast
 * 
 */
import { toast } from "bulma-toast";
import { onMounted, onUnmounted } from 'vue';

export default function() {
  function onconnect() {
    if (window.navigator.onLine) {
      toast({
        message: 'App is online!',
        position: 'top-center',
        type: 'is-success',
        opacity: 0.8,
        dismissible: true,
        pauseOnHover: true,
        closeOnClick: true,
        duration: 2000,
        //animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
    console.log("connect")
  }

  function ondisconnect() {
    if (!window.navigator.onLine) {
      toast({
        message: 'Offline!',
        position: 'top-center',
        type: 'is-danger',
        opacity: 0.8,
        dismissible: true,
        pauseOnHover: true,
        closeOnClick: true,
        duration: 2000,
        //animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
    console.log("disconnect")
  }

  onMounted(() => {
    window.addEventListener("online", onconnect);
    window.addEventListener("offline", ondisconnect);
  });

  onUnmounted(() => {
    window.removeEventListener("online", onconnect);
    window.removeEventListener("offline", ondisconnect);
  });

  onconnect();
  ondisconnect();
}