/** Connectivity Detection and Bulma Toast notification 
 * 
 * USAGE
 *  import useConnToast from '@/functions/conn-toast.js';
 *  export default {
 *    setup(){
 *      useConnToast();
 *    }
 *  }
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
          // dismissible: true,
          // duration: 200,
          // animate: { in: 'fadeIn', out: 'fadeOut' }
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
          // dismissible: true,
          // duration: 200,
          // animate: { in: 'fadeIn', out: 'fadeOut' }
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

    // return { onconnect, ondisconnect }
}
