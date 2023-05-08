<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_headword_search="true"
             v-bind:search_string="queueData.current_headword"
             v-on:search-headword-navbar="onSearchHeadword"
             :key="queueData.counter" />

  <section class="section">    
    <div class="container is-centered" style="max-width: 720px;">

      <!-- Ranking Overview Modal: the button-->
      <div class="field is-grouped is-grouped-centered" style="position: sticky; display: inline-block;"> 
        <p class="control">
          <button class="button is-rounded is-info" 
                  v-on:click="showModal = true">
            <span class="icon"><i class="fas fa-filter"></i></span>
            <strong>Ranking Overview</strong>
          </button>
        </p>
      </div>

      <template v-if="queueData.current.length > 0">
        <!-- BWS UI -->
        <BestWorstChoices 
          v-bind:items="queueData.current"
          v-on:ranking-done="nextExampleSet"
          :key="queueData.counter"
        />
        <!-- progress in Zahlen -->
        <br/>
        <p class="has-text-right is-size-6 has-text-grey is-italic">
          <output>
            {{ queueData.counter }}
          </output>
          sets ranked or skipped so far.
          <br/>
          <output>
            {{ queueData.queue.length }}
          </output>
          sets loaded and left to rank.
          <br/>
          <output>
            {{ currentPoolSize }}
          </output>
          sentence examples available.
        </p>
        <br/>
        <!-- Info Message -->
        <h6 class="title is-6">Bedienungshinweise</h6>
        <p class="is-size-6 has-text-grey is-italic">
          <ol>
            <li>Wähle zuerst den schlechtesten Satzbeleg aus (orange) und danach den besten Satzbeleg (blau).</li>
            <li>Um die Entscheidund zu revidieren, klicke auf den zuletzt angekickten Satzbeleg.</li>
            <li>Klicke auf den grünen OK-Button, um die Bewertung zu speichern und fortzufahren.</li>
            <li>Klicke auf den gelben Skip-Button, um die Bewertung zu überspringen und fortzufahren.</li>
            <li>Klicken auf den blauen Button "Ranking Overview", um alle Satzbelege mit den trainierten Modellscores zu sehen.</li>
          </ol>
          <!-- First choose the worst sentence example (orange), and then the best sentence example (blue). -->
        </p>
      </template>
      <template v-else>
        <PageLoader 
          v-bind:status="queueData.current.length == 0"
          v-bind:messages="['Queue is empty!', message_suggestion]" />
      </template>

    </div>
  </section>


  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Current Rankings & Model Scores</p>
        <button class="delete" aria-label="close" v-on:click="showModal = false"></button>
      </header>
      <section class="modal-card-body" v-if="showModal">
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
        <!-- <div class="card" v-for="(item, idx) in getPoolData()" :key="idx"> -->
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
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import BestWorstChoices from '@/components/bestworst/Choices.vue';
import { defineComponent, watchEffect, watch, ref, toRaw, computed } from 'vue'; // unref, watch, computed
import { useI18n } from 'vue-i18n';
//import { useApi, useAuth } from '@/functions/axios-evidence.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
//import { traverseObject } from '@/functions/traverse-objects.js';
// import { ranking } from 'bwsample';
import { useInteractivity } from '@/components/bestworst/interactivity.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { v4 as uuid4 } from 'uuid';


export default defineComponent({
  name: "BestWorst4",

  components: {
    TheNavbar,
    PageLoader,
    BestWorstChoices
  },

  setup(){
    // multi-lingual settings
    const { t } = useI18n();

    watchEffect(() => {
      document.title = t('bestworst.title');
    });


    // Load General UI settings
    const { 
      has_data_donation_consent,
      debug_verbose,
      loadGeneralSettings
    } = useGeneralSettings();
    loadGeneralSettings();

    // Load BWS Settings
    const { 
      queue_reorderpoint, 
      retrain_patience, 
      loadBwsSettings 
    } = useBwsSettings();
    loadBwsSettings();


    // Load reactive variables for BWS Queue
    const { 
      uispec, 
      search_headword, 
      queueData, 
      isReplenishing, 
      message_suggestion,
      isSaving, 
      saveEvaluations,
      flushEvaluations,
      pullFromQueue, 
      nextExampleSet, 
      resetQueue
    } = useQueue();

    // configure UI meta info
    uispec["name"] = "bestworst4";

    // Load Interactivity Settings
    const { 
      pool, 
      resetPool,
      dropExamplesFromPool,
      addExamplesToPool,
      updatePairMatrix,
      sampleBwsSets, 
      computeTrainingScores,
      retrainModel,
      predictScores
    } = useInteractivity();


    /**
     * [A1] Specify Replenishment from local `pool`
     * 
     * Global variables from queue.js
     * ------------------------------
     * @param {String} search_headword
     * @param {JSON}   data
     * @param {Boolan} isReplenishing
     * @param {String} message_suggestion
     * Function: pullFromQueue
     * 
     * Global variables from interactivity.js
     * --------------------------------------
     * 
     */
    const replenishQueue = async() => {
      // (Step 1) Drop examples
      await dropExamplesFromPool();

      // (Step 2) Add examples to pool
      await addExamplesToPool(search_headword.value);

      return new Promise((resolve, reject) => {
        try{
          isReplenishing.value = true;
          // (Step 3) Sample BWS sets from pool
          const sampled_bwssets = sampleBwsSets();
          // => In der App anzeigen =>
          sampled_bwssets.forEach(exset => {
            var examples = []
            exset.forEach(key => {
              examples.push({
                "id": key,
                "text": pool[key].text,
                "spans": pool[key].span
              });
            });
            queueData.queue.push({
              set_id: uuid4(),
              headword: search_headword.value.trim(),
              examples: examples
            })
          });
          isReplenishing.value = false;
          // Force moving a BWS set to UI
          if (queueData.current.length === 0){
            pullFromQueue(); // load data
            console.log("New current BWS set loaded")   // queueData.current
          }
          resolve();
        }catch(msg){
          message_suggestion.value = "Unknown Error!";
          reject(msg)
        }
      });
    }
    
    /**
     * [A2] Load initial current BWS-exampleset
     * DEACTIVATED! Is triggered via low running queue [A3] 
     *         or search request via `onSearchHeadword` [A4]
     */
    //replenishQueue();


    /** 
     * [A3] Trigger AJAX request to replenish the queue
     */
    watch(
      () => queueData.queue.length,
      (stocklevel) => {
        if (stocklevel < queue_reorderpoint.value){
          if(debug_verbose.value){console.log(`[A3] Queue is running low: ${stocklevel} examplesets`);}
          replenishQueue();
          if(debug_verbose.value){console.log(`[A3] New pool size: ${Object.keys(pool).length}`);}
        }
      }
    );


    /**
     * [A4] Store the new Lemma, Reset the Queue data, Load new data
     */
    const onSearchHeadword = async(keywords) => {
      // delete pool and pairs matrix
      resetPool();
      // delete current example set in UI, and the whole queue.
      resetQueue();
      // reset `search_headword`
      search_headword.value = keywords
      // force to load next example in UI
      await replenishQueue();
    }


    /** 
     * [B1] Trigger AJAX to post evaluated BWS-exampleset to database
     * - `saveEvaluations` will purge `queueData.evaluated`
     */
    watch(
      () => queueData.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0 && !isSaving.value){
          // interactivity.js: Step (4)
          updatePairMatrix(queueData);

          // queue.js: save or delete
          if( has_data_donation_consent.value ){
            saveEvaluations();  // queue.js: Purge `queueData.evaluated`
          }else{
            flushEvaluations();  // just purge `queueData.evaluated`
          }
        }
    });

    /**
     * [B2] Training phase 
     */
    watch(
      () => queueData.counter,
      (counter) => {
        if ((counter % retrain_patience.value) === 0){
          if(debug_verbose.value){console.log(`Counter: ${counter}`)}
          computeTrainingScores();  // (Step 5)
          retrainModel();  // (Step 6)
          predictScores();  // (Step 7)
        }
    });


    // Ranking overview modal
    const showModal = ref(false);

    const getPoolData = () => {
      const arr = Object.values(toRaw(pool));
      console.log("ARR", arr)
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

    const currentPoolSize = computed(() => {
      return Object.keys(pool).length
    })

    return { 
      queueData, 
      nextExampleSet,
      onSearchHeadword,
      message_suggestion,
      // fot the Ranking Overview modal
      showModal, getPoolData, currentPoolSize
    }
  },

});
</script>

<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
}
</style>