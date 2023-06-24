<template>
  <div class="modal" :class="{ 'is-active': showModalTfjsConvergence }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">TFJS Loss Convergence</p>
        <button class="delete" aria-label="close" v-on:click="$emit('close')"></button>
      </header>
      <section class="modal-card-body" v-if="showModalTfjsConvergence">
        <!-- Content ... -->
        <!-- <h2 class="title is-5">Modelltraining</h2> -->
        <table class="table">
          <thead>
            <tr>
              <th>Iter.</th>
              <th>Lemma</th>
              <th>Loss</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, idx) in current_training_losses" :key="idx">
              <tr>
                <td>{{ idx + 1}}</td>
                <td>{{ item?.headword }}</td>
                <td>{{ item?.loss }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <!-- Content ... -->
      </section>
    </div>
  </div>
</template>

<script>

import { useI18n } from 'vue-i18n';
import { defineComponent,  } from "vue";


export default defineComponent({
  name: 'ModalTFJSConvergence',

  // components: {  },

  props: {
    showModalTfjsConvergence: Boolean,
    current_training_losses: Array,
  },

  emits: [
    'search-headword-modal'
  ],

  setup(){
    const { t } = useI18n();

    return { 
      t,
    }
  }
});

</script>

