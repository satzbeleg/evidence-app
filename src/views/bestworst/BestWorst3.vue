<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_lemmata_search="true"
             v-bind:lemma_keywords="data.current_lemmata"
             v-on:search-lemmata-navbar="onSearchLemmata"
             :key="data.counter" />

  <section class="section">    
    <div class="container is-centered" style="max-width: 720px;">

      <template v-if="data.current.length > 0">
        <!-- BWS UI -->
        <BestWorstChoices 
          v-bind:items="data.current"
          v-on:ranking-done="nextExampleSet"
          :key="data.counter"
        />
        <!-- progress bar -->
        <progress class="progress is-info mt-5" 
                  v-bind:value="data.queue.length" 
                  v-bind:max="maxprogress">
          {{ data.queue.length }}
        </progress>
      </template>
      <template v-else>
        <PageLoader 
          v-bind:status="data.current.length == 0"
          v-bind:messages="['Queue is empty!', message_suggestion]" />
      </template>

    </div>
  </section>
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import BestWorstChoices from '@/components/bestworst/Choices.vue';
import { defineComponent, watchEffect, watch, unref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi, useAuth } from '@/functions/axios-evidence.js';
import { useSettings } from '@/functions/settings.js';
import { useBwsQueue } from '@/components/bestworst/queue.js';


export default defineComponent({
  name: "BestWorst3",

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


    // (a) Load bestworst3 UI settings
    const { 
      loadSettings, 
      reorderpoint, orderquantity,
      sampling_numtop, sampling_offset 
    } = useSettings();
    loadSettings();

    // (0b) Load reactive variables for BWS Queue
    const { 
      uispec, searchlemmata, data, 
      isReplenishing, message_suggestion,
      isSaving, saveEvaluations,
      pullFromQueue, nextExampleSet, 
      resetQueue
    } = useBwsQueue();

    // configure UI meta info
    uispec["name"] = "bestworst3";


    /**
     * (1) Replenish data.queue from database (load new example sets into queue)
     */
    const replenishQueue = () => {
      return new Promise((resolve, reject) => {
        // Replensihing started
        isReplenishing.value = true;
        // preprocess lemmata/keyword search for POST request
        var params = {}
        if (typeof searchlemmata.value == "string"){
          if (searchlemmata.value.length > 0){
            params = {"lemmata": searchlemmata.value.split(',').map(s => s.trim())}
          }
        }
        // load other functions and objects
        const { getToken } = useAuth();
        const { api } = useApi(getToken());
        // start API request
        message_suggestion.value = "Loading new example sets ...";
        api.post(`v1/bestworst/samples/4/${unref(orderquantity)}/${unref(sampling_numtop)}/${unref(sampling_offset)}`, params)
        .then(response => {
          // Is there any error message returned?
          if ('msg' in response.data){
            message_suggestion.value = response.data['msg'];
          }else if (typeof response.data == "object"){
            // copy all example sets
            response.data.forEach(exset => data.queue.push(exset));
          }else{
            message_suggestion.value = "API returned unexpected data.";
          }
          resolve(response);
        })
        .catch(error => {
          // message to user
          message_suggestion.value = "Unknown Error!";
          reject(error);
        })
        .finally(() => {
          isReplenishing.value = false;
          console.log(`Queue replenished to ${data.queue.length} examplesets`);
          if (data.current.length === 0){
            pullFromQueue(); // load data
            console.log("New current BWS set loaded")
          }
          console.log("After API Call:", data)
        });
      });
    }


    /** 
     * (1b) Trigger AJAX request to replenish the queue
     */
    watch(
      () => data.queue.length,
      (stocklevel) => {
        if (stocklevel < reorderpoint.value){
          console.log(`Queue is running low: ${stocklevel} examplesets`);
          replenishQueue();
        }
      }
    );

    /**
     * (2) Trigger AJAX to post evaluated BWS-exampleset
     */
    watch(
      () => data.evaluated.length,
      (num_evaluated) => {
        if (num_evaluated > 0 && !isSaving.value){
          console.log(`Number of evaluated BWS example sets: ${num_evaluated}`);
          saveEvaluations();
        }
      }
    );


    /**
     * (3) Store the new Lemma, Reset the Queue data, Load new data
     */
    const onSearchLemmata = async(keywords) => {
      // delete current example set in UI, and the whole queue.
      resetQueue();
      // reset `searchlemmata`
      searchlemmata.value = keywords
      // force to load next example in UI
      await replenishQueue();
    }


    /**
     * (3b) Load initial current BWS-exampleset
     */
    replenishQueue();


    // compute max for progressba
    const maxprogress = computed(() => parseInt(reorderpoint.value) + parseInt(orderquantity.value));


    return { 
      data, 
      nextExampleSet,
      maxprogress,
      onSearchLemmata,
      message_suggestion
    }
  },

});
</script>

