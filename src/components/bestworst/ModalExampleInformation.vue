<template>
  <div class="modal" :class="{ 'is-active': showModalInformation }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Information über das Beispiel</p>
        <button class="delete" aria-label="close" v-on:click="$emit('close')"></button>
      </header>
      <section class="modal-card-body" v-if="showModalInformation">
        <!-- Content ... -->
        <h2 class="title is-5">Angaben über den Satzbeleg</h2>
        <table class="table">
          <tbody>
            <tr>
              <td>Satzbeleg</td>
              <td>{{ exampleMeta?.text }}</td>
            </tr>
            <tr>
              <td>Lemma</td>
              <td>{{ exampleMeta?.headword }}</td>
            </tr>
            <tr>
              <td>Position</td>
              <td>{{ exampleMeta?.spans }}</td>
            </tr>
            <tr>
              <td>Quelle</td>
              <td>{{ exampleMeta?.context?.biblio }}</td>
            </tr>
            <tr>
              <td>Lizenz</td>
              <td>{{ exampleMeta?.context?.license }}</td>
            </tr>
            <tr>
              <td>sentence_id</td>
              <td>{{ exampleMeta?.context?.sentence_id }}</td>
            </tr>
            <tr>
              <td>example_id</td>
              <td>{{ exampleMeta?.example_id }} (lemma, sentence)</td>
            </tr>
          </tbody>
        </table>

        <h2 class="title is-5">Exportiere Satzbeleg</h2>
        <CopyToClipboadButton 
          :text="exampleMeta?.text" 
          :biblio="exampleMeta?.context?.biblio" 
        />

        <br/>

        <template v-if="exampleMeta?.weight">
          <h2 class="title is-5">
            {{ weightType == 'similarity' ? 'Similarity' : 'Trade-Off' }}
          </h2>
          <table class="table">
            <tbody>
              <tr>
                <td>
                  {{ weightType == 'similarity' ? 'Score' : 'Weight' }}
                </td>
                <td>{{ exampleMeta?.weight }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-if="exampleMeta?.training_score_history">
          <h2 class="title is-5">Modelltraining</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Iter.</th>
                <th>Target Score</th>
                <th>Model Score</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(target_score, idx) in exampleMeta?.training_score_history" :key="idx">
                <tr>
                  <td>{{ idx }}</td>
                  <td>{{ target_score }}</td>
                  <td>{{ exampleMeta?.model_score_history[idx] }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
 

        <!-- <h2 class="title is-5">Similar Sentences</h2>
        {{ exampleMeta?.similarities?. }} -->
        <!-- Content ... -->
        <!-- <p>{{ exampleMeta }}</p> -->
        

      </section>
    </div>
  </div>
</template>

<script>

import { useI18n } from 'vue-i18n';
import { defineComponent } from "vue";
import CopyToClipboadButton from '@/components/bestworst/CopyToClipboadButton.vue';

export default defineComponent({
  name: 'ModalExampleInformation',

  components: {
    CopyToClipboadButton
  },

  props: {
    showModalInformation: Boolean,
    exampleMeta: Object,
    weightType: String,
  },

  setup(){
    const { t } = useI18n();

    return { 
      t,
    }
  }
});

</script>

