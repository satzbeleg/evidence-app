<template>
  <div class="modal" :class="{ 'is-active': showModalOverview }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Current Rankings & Model Scores</p>
        <button class="delete" aria-label="close" v-on:click="$emit('close')"></button>
      </header>
      <section class="modal-card-body" v-if="showModalOverview">
        <!-- Content ... -->
        <div class="card">
          <div class="card-content">
            <h6 class="title is-6">Hinweise</h6>
          <p class="is-size-6 has-text-grey is-italic">
            In den Karten sind rechts folgende Informationen zu sehen:
            <ul>
              <li>Die Anzahl der expliziten oder impliziten Bewertungen, z.B. "3x".</li>
              <li>Die Satzbelege sind nach den Trainingscores sortiert, die sich direkt aus Ihren BWS-Rankings ergeben; in den Karten steht bspw. "76.4 (r)" (von 0 bis 100 mit "r" in Klammern).</li>
              <li>Im Hintergrund wird in Echtzeit ein individuelles Machine-Learning Prognosemodell trainiert; die Modellscores werden bspw. als "56.7 (m)" angezeigt (von 0 bis 100 mit "m" in Klammern).</li>
            </ul>
          </p>
        </div>
        </div>
        <div class="card" v-for="(item, idx) in getPoolData()" :key="idx">
          <div class="card-content">
            <div class="column">
              <div class="columns is-mobile">
                <div class="column is-10">
                  <p>{{ item.text }}</p>
                  <p class="is-size-7 has-text-grey is-italic"> {{ item.context.biblio }} </p>
                  <p class="is-size-7 has-text-grey is-italic"> {{ item.context.license }} </p>
                </div>
                <div class="column">
                  <p class="is-size-7 has-text-grey is-italic"> {{ item.num_displayed }} x</p>
                  <p class="is-size-7 has-text-grey is-italic"> {{ (item.last_training_score * 100.).toFixed(1) }} (r)</p>
                  <p class="is-size-7 has-text-grey is-italic"> {{ (item.last_model_score * 100.).toFixed(1) }} (m)</p> 
                </div>
              </div>
            </div>

          </div>
        </div>
        <!-- Content ... -->
      </section>
    </div>
  </div>
</template>

<script>

import { useI18n } from 'vue-i18n';
import { defineComponent, toRaw } from "vue";

export default defineComponent({
  name: 'ModalRankingOverview',

  components: {},

  props: {
    showModalOverview: Boolean,
    pool: Object
  },

  setup(props){
    const { t } = useI18n();

    // Ranking overview modal
    const getPoolData = () => {
      const arr = Object.values(toRaw(props.pool));
      if (arr.length > 0){
        return arr.slice().sort((a, b) => {
          if (a.last_training_score < b.last_training_score){return 1;}
          else if (a.last_training_score > b.last_training_score){return -1;}
          else if (a.last_model_score < b.last_model_score){return 1;}
          else if (a.last_model_score > b.last_model_score){return -1;}
          return 0;
        })
      }
      return arr
    }

    return { 
      t,
      getPoolData
    }
  }
});

</script>

