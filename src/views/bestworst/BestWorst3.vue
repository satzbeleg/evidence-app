<template>
  <TheNavbar v-bind:with_lang_switch="false"
             v-bind:with_darkmode_icon="false"
             v-bind:with_headword_search="true"
             v-bind:search_string="queueData.current_headword"
             v-on:search-headword-navbar="onSearchHeadword"
             :key="queueData.counter" />

  <section class="section">    
    <div class="container is-centered" style="max-width: 720px;">

      <template v-if="queueData.current.length > 0">
        <!-- BWS UI -->
        <BestWorstChoices 
          v-bind:items="queueData.current"
          v-on:ranking-done="nextExampleSet"
          :key="queueData.counter"
        />
        <!-- progress bar -->
        <progress class="progress is-info mt-5" 
                  v-bind:value="queueData.queue.length" 
                  v-bind:max="maxprogress">
          {{ queueData.queue.length }}
        </progress>
        <!-- progress in Zahlen -->
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
</template>


<script>
import TheNavbar from '@/components/layout/TheNavbar.vue';
import PageLoader from '@/components/layout/PageLoader.vue';
import BestWorstChoices from '@/components/bestworst/Choices.vue';
import { defineComponent, watchEffect, watch, unref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi2, useAuth } from '@/functions/axios-evidence.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useQueue } from '@/components/bestworst/queue.js';
import router from '@/router';

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


    // Load bestworst3 UI settings
    const { 
      loadBwsSettings, 
      queue_reorderpoint, 
      queue_orderquantity,
      item_sampling_numtop, 
      item_sampling_offset 
    } = useBwsSettings();
    loadBwsSettings();
    console.log(queue_reorderpoint.value, queue_orderquantity.value, item_sampling_numtop.value, item_sampling_offset.value)

    // Load reactive variables for BWS Queue
    const { 
      uispec, 
      search_headword, 
      queueData, 
      isReplenishing, 
      message_suggestion,
      isSaving, 
      saveEvaluations,
      pullFromQueue, 
      nextExampleSet, 
      resetQueue
    } = useQueue();

    // configure UI meta info
    uispec["name"] = "bestworst3";


    /**
     * [A1] Replenish queueData.queue from database (load new example sets into queue)
     */
    const replenishQueue = async() => {
      return new Promise((resolve, reject) => {
        // Replensihing started
        isReplenishing.value = true;
        // preprocess headword/keyword search for POST request
        var params = {}
        if (typeof search_headword.value == "string"){
          if (search_headword.value.length > 0){
            params = {"headword": search_headword.value.trim()}
          }
        }
        // load other functions and objects
        const { getToken, logout } = useAuth();
        const { api } = useApi2(getToken());
        // start API request
        message_suggestion.value = "Loading new example sets ...";
        api.post(`v1/bestworst/samples/4/${unref(queue_orderquantity)}/${unref(item_sampling_numtop)}/${unref(item_sampling_offset)}`, params)
        .then(response => {
          // Is there any error message returned?
          if ('msg' in response.data){
            message_suggestion.value = response.data['msg'];
          }else if (typeof response.data == "object"){
            // copy all example sets
            response.data.forEach(exset => queueData.queue.push(exset));
          }else{
            message_suggestion.value = "API returned unexpected queueData.";
          }
          resolve(response);
        })
        .catch(error => {
          if (error.response.status === 401) {
            console.log("Unauthorized: ", error.response.data);
            logout();
            router.push('/auth/login');
          }
          // message to user
          message_suggestion.value = "Unknown Error!";
          reject(error);
        })
        .finally(() => {
          isReplenishing.value = false;
          console.log(`Queue replenished to ${queueData.queue.length} examplesets`);
          if (queueData.current.length === 0){
            pullFromQueue(); // load data
            console.log("New current BWS set loaded")
          }
          // console.log("After API Call:", data)
        });
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
          console.log(`Queue is running low: ${stocklevel} examplesets`);
          replenishQueue();
        }
      }
    );


    /**
     * [A4] Store the new Lemma, Reset the Queue data, Load new data
     */
    const onSearchHeadword = async(keywords) => {
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
          console.log(`Number of evaluated BWS example sets: ${num_evaluated}`);
          saveEvaluations();
        }
      }
    );


    // compute max for progressbar
    const maxprogress = computed(() => parseInt(queue_reorderpoint.value) + parseInt(queue_orderquantity.value));


    return { 
      queueData, 
      nextExampleSet,
      maxprogress,
      onSearchHeadword,
      message_suggestion
    }
  },

});
</script>

