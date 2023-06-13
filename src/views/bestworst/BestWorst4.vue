<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_headword_search="true"
             v-bind:search_string="queueData.current_headword"
             v-on:search-headword-navbar="onSearchHeadword"
             :key="queueData.counter" />

  <section class="section">    
    <div class="container is-centered" style="max-width: 720px;">

      <!-- Buttons -->
      <div class="field is-grouped is-grouped-centered" style="position: sticky; display: inline-block;"> 
        <p class="control buttons">
          <!-- Ranking Overview Modal: the button-->
          <button class="button is-rounded is-info" 
                  v-on:click="showModalOverview = true">
            <span class="icon"><i class="fas fa-filter"></i></span>
            <strong>Rankings</strong>
          </button>
          <!-- BWS Settings Modal: the button-->
          <button class="button is-rounded is-dark" 
                  v-on:click="showModalBwsSettings = true">
            <span class="icon"><i class="fas fa-search"></i></span>
            <strong>Settings</strong>
          </button>
        </p>
      </div>


      <template v-if="queueData.current.length > 0 && !isLoadingData">
        <!-- BWS UI -->
        <BestWorstChoices 
          v-bind:items="queueData.current"
          v-on:ranking-done="nextExampleSet"
          :key="queueData.counter"
          v-bind:hasInfoModal="true"
        />
        <!-- progress in Zahlen -->
        <br/>
        <p class="has-text-right is-size-6 has-text-grey is-italic">
          Training Loss:
          <output :class="cssLossColor">
            {{ Math.round(last_training_loss * 10000.0) / 10000.0 }}
          </output>
          <br/>
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

      <template v-if="queueData.current.length == 0 && !isLoadingData">
        <PageLoader 
          v-bind:status="true"
          v-bind:messages="['Sentence pool is empty!', 'Please search for a headword']" 
        />
      </template>

      <PageLoader v-show="isLoadingData"
        v-bind:status="true"
        v-bind:messages="['Loading data for lemma', search_headword]" 
      />


    </div>
  </section>

  <ModalRankingOverview 
    v-bind:showModalOverview="showModalOverview" 
    v-bind:pool="pool"
    @close="showModalOverview = false"
  />

  <ModalBwsSearchSettings
    v-bind:showModalBwsSettings="showModalBwsSettings" 
    v-bind:search_string="queueData.current_headword"
    v-on:search-headword-modal="onSearchHeadword"
    @close="showModalBwsSettings = false"
  />

</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import BestWorstChoices from '@/components/bestworst/Choices.vue';
import { defineComponent, watchEffect, watch, ref, computed } from 'vue'; // unref, watch, computed
import { useI18n } from 'vue-i18n';
//import { useApi, useAuth } from '@/functions/axios-evidence.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
//import { traverseObject } from '@/functions/traverse-objects.js';
// import { ranking } from 'bwsample';
import { useInteractivity } from '@/components/bestworst/interactivity.js';
import { useQueue } from '@/components/bestworst/queue.js';
import { useSimilarityVectors } from '@/components/variation/similarity-vectors.js';
import { v4 as uuid4 } from 'uuid';
import ModalRankingOverview from '@/components/bestworst/ModalRankingOverview.vue';
import ModalBwsSearchSettings from '@/components/bestworst/ModalBwsSearchSettings.vue';


export default defineComponent({
  name: "BestWorst4",

  components: {
    TheNavbar,
    PageLoader,
    BestWorstChoices,
    ModalRankingOverview,
    ModalBwsSearchSettings
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
      item_sampling_method, // to trigger similarity computation
      loadBwsSettings,
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
      predictScores,
      last_training_loss,
    } = useInteractivity();

    // util functions to compute similarity vectors for each example
    const { computeSimilaries } = useSimilarityVectors();

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

      // (Step 3) Compute similarity vectors if "semantic clustering" is enabled
      if(item_sampling_method.value === "semantic-similar"){
        await computeSimilaries(pool);
      }
      // console.log("Pool", Object.values(pool))
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
                "spans": pool[key].span,
                "all_meta": pool[key],
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
    const isLoadingData = ref(false);

    const onSearchHeadword = async(keywords) => {
      // delete pool and pairs matrix
      resetPool();
      // delete current example set in UI, and the whole queue.
      resetQueue();
      // reset `search_headword`
      search_headword.value = keywords
      // force to load next example in UI
      isLoadingData.value = true;
      await replenishQueue();
      isLoadingData.value = false;
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


    const currentPoolSize = computed(() => {
      return Object.keys(pool).length
    })

    // Ranking overview modal
    const showModalOverview = ref(false);

    // BWS Settings modal
    const showModalBwsSettings = ref(false);


    const cssLossColor = ref("");
    watch(
      () => last_training_loss.value,
      (loss) => {
        if (loss < 0.01){
          cssLossColor.value = "has-background-success has-text-white";
        }else if (loss < 0.05 && loss >= 0.01){
          cssLossColor.value = "has-background-warning has-text-black";
        }else{
          cssLossColor.value = "has-background-danger has-text-white";
        }
      }
    );

    return { 
      queueData, 
      nextExampleSet,
      onSearchHeadword,
      // message_suggestion, 
      isLoadingData, search_headword,
      currentPoolSize,
      // fot the Ranking Overview modal
      showModalOverview, pool, 
      last_training_loss, cssLossColor,
      // BWS Settings modal
      showModalBwsSettings,
    }
  },

});
</script>

<style scoped>
.card {
  margin-bottom: min(2vh, 25px); /* min(2vh, 25px); */
}
</style>