export default {
  mounted() {
    /** online */
    window.addEventListener("online", this.onconnect);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener("online", this.onconnect);
    });
    this.onconnect();
    /** offline */
    window.addEventListener("offline", this.ondisconnect);
    this.$on("hook:beforeDestroy", () => {
      window.removeEventListener("offline", this.ondisconnect);
    });
    this.ondisconnect();
  },
  methods: {
    onconnect() {
      if (navigator.onLine) {
        this.$buefy.toast.open({
          message: 'App is online!',
          position: 'is-bottom',
          type: 'is-success'
        });
      }
    },
    ondisconnect() {
      if (!navigator.onLine) {
        this.$buefy.toast.open({
          message: 'Offline!',
          position: 'is-bottom',
          type: 'is-danger'
        });
      }
    }
  }
};

/** Sources
 * https://dev.to/jcalixte/creating-an-vuejs-component-for-online-offline-events-31mc
 * https://stackoverflow.com/a/49872651
 */