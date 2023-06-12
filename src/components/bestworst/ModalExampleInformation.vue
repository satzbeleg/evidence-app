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
              <td>{{ exampleMeta["text"] }}</td>
            </tr>
            <tr>
              <td>Lemma</td>
              <td>{{ exampleMeta["headword"] }}</td>
            </tr>
            <tr>
              <td>Position</td>
              <td>{{ exampleMeta["spans"] }}</td>
            </tr>
            <tr>
              <td>Quelle</td>
              <td>{{ exampleMeta["context"]["biblio"] }}</td>
            </tr>
            <tr>
              <td>Lizenz</td>
              <td>{{ exampleMeta["context"]["license"] }}</td>
            </tr>
            <tr>
              <td>sentence_id</td>
              <td>{{ exampleMeta["context"]["sentence_id"] }}</td>
            </tr>
            <tr>
              <td>example_id</td>
              <td>{{ exampleMeta["example_id"] }} (lemma, sentence)</td>
            </tr>
          </tbody>
        </table>

        <button class="button is-rounded" @click="copy2clipboard()">
          <span class="icon is-small is-left"><i class="far fa-copy"></i></span>
          <span class="is-right">Copy XML</span>
        </button>

        <br/>

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
            <template v-for="(target_score, idx) in exampleMeta['training_score_history']" :key="idx">
              <tr>
                <td>{{ idx }}</td>
                <td>{{ target_score }}</td>
                <td>{{ exampleMeta['model_score_history'][idx] }}</td>
              </tr>
            </template>
          </tbody>
        </table>
 

        <!-- Content ... -->
        <!-- <p>{{ exampleMeta }}</p> -->
        

      </section>
    </div>
  </div>
</template>

<script>

import { useI18n } from 'vue-i18n';
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ModalExampleInformation',

  components: {},

  props: {
    showModalInformation: Boolean,
    exampleMeta: Object
  },

  setup(props){
    const { t } = useI18n();

    const copy2clipboard = () => {
      const xmltxt = `
<Beleg>
  <Belegtext>
    ${props.exampleMeta['text']}
  </Belegtext>
  <Fundstelle>
    <Bibl>
      ${props.exampleMeta['context']['biblio']}
    </Bibl>
  </Fundstelle>
</Beleg>
`;
      navigator.clipboard.writeText(xmltxt);
    }

    return { 
      t,
      copy2clipboard,
    }
  }
});

</script>

