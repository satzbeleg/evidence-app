/** "bestworst1/unlabeled" to manage the example sets as FIFO queue */
export default {
  namespaced: true,

  state: () => ({
    /** Array with unlabelled example sets. It's a FIFO queue */
    queue: [{
        "set_id": "some-rnd-id-generated-1",
        "examples": [
          { "id": "23", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
          { "id": "34", "text": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
          { "id": "45", "text": "Duis aute irure dolor in  reprehenderit in voluptate velit esse cillum sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
          { "id": "56", "text": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." }
        ]
      },
      {
        "set_id": "some-rnd-id-generated-2",
        "examples": [
          { "id": "121", "text": "Es gibt im Moment in diese Mannschaft, oh, einige Spieler vergessen ihnen Profi was sie sind. Ich lese nicht sehr viele Zeitungen, aber ich habe gehört viele Situationen. Erstens: wir haben nicht offensiv gespielt. Es gibt keine deutsche Mannschaft spielt offensiv und die Name offensiv wie Bayern. Letzte Spiel hatten wir in Platz drei Spitzen: Elber, Jancka und dann Zickler. Wir müssen nicht vergessen Zickler. Zickler ist eine Spitzen mehr, Mehmet eh mehr Basler. Ist klar diese Wörter, ist möglich verstehen, was ich hab gesagt? Danke. Offensiv, offensiv ist wie machen wir in Platz." },
          { "id": "122", "text": "Er konnte die Aufforderung stehen zu bleiben schon hören. Gehetzt sah er sich um. Plötzlich erblickte er den schmalen Durchgang. Blitzartig drehte er sich nach rechts und verschwand zwischen den beiden Gebäuden." },
          { "id": "123", "text": "Ich habe gesehen auch zwei Tage die Training. Ein Trainer ist nicht ein Idiot! Ein Trainer sei sehen was passieren in Platz. In diese Spiel es waren zwei, drei diese Spieler waren schwach wie eine Flasche leer! Haben Sie gesehen Mittwoch, welche Mannschaft hat gespielt Mittwoch? Hat gespielt Mehmet oder gespielt Basler oder hat gespielt Trapattoni? Diese Spieler beklagen mehr als sie spielen!" },
          { "id": "124", "text": "Seit 1975 fehlen in den meisten Testtexten die Zahlen, weswegen nach TypoGb. 204 § ab dem Jahr 2034 Zahlen in 86 der Texte zur Pflicht werden. Nichteinhaltung wird mit bis zu 245 € oder 368 $ bestraft." }
        ]
      },
      {
        "set_id": "some-rnd-id-generated-3",
        "examples": [
          { "id": "291", "test": "Eine wunderbare Heiterkeit hat meine ganze Seele eingenommen, gleich den süßen Frühlingsmorgen, die ich mit ganzem Herzen genieße." },
          { "id": "292", "test": "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular." },
          { "id": "293", "test": "Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt." },
          { "id": "294", "test": "Überall dieselbe alte Leier." },
        ]
      }
    ],

    /** Settings: Max #num of example sets to store in the queue */
    maxCapacity: 10,
    /** Settings: Triggers API call to fetch more example sets */
    reorderPoint: 3
  }),

  mutations: {
    /** Add new unlabelled examples (from REST API) */
    APPEND_SAMPLE: (state, newsets) => {
      state.queue = state.queue.concat(newsets);
    },
  },

  actions: {
    /** Add a sample of new unlabelled examples (from REST API) */
    fetchSamples: async(state, orderQuantity) => {
      return new Promise((resolve, reject) => {
        try {
          state.commit("APPEND_SAMPLE", [{ "set_id": "nothing-here-234" }]);
          resolve(`succcess: fetchSamples(${orderQuantity}) called`);
        } catch (err) {
          reject(err);
        }
      });
    },
    /** Check if the queue is running low, and trigger replenishment */
    replenishQueue: async(state, getters) => {
      if (getters.getStockLevel < state.reorderPoint) {
        const orderQuantity = Math.max(0, state.maxCapacity - getters.getStockLevel);
        if (orderQuantity > 0) {
          await state.dispatch('fetchSamples', orderQuantity);
        }
      }
    },
  },

  getters: {
    /** Return 1st element and delete it from array */
    dequeueNext: (state) => {
      var tmp = state.queue.shift();
      return tmp;
    },
    /** Stock level: How many example sets are still available? */
    getStockLevel: (state) => {
      return state.queue.length;
    }
  }
}