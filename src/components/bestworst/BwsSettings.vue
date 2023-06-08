<template>
  <h1 class="title is-3 is-spaced">Best-Worst Scaling</h1>

  <h2 class="subtitle is-4">Offline Queue</h2>   <!-- Offline Warteschlange -->
  <div class="content">
    <p v-if="language == 'de'">
      Die Benutzeroberfläche hat eine eigene Warteschlange mit vorgeladenen BWS-Gruppen. Sie funktioniert offline im Falle von Netzwerkunterbrechungen und füllt sich automatisch im Hintergrund auf.
      Die Warteschlange ist ein Lagerhaltungsmodell mit fixen Meldebstand (reorder point) und fixer Bestellmenge (order quantity).
    </p>
    <p v-else>
      The BWS UI has its own queue of preloaded BWS sets. It works offline in case of network interruptions, and replenishes the queue in the background. 
      The queue follows a Fixed Quantity inventory model with a given reorder point and order quantity.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="queue-reorderpoint">
          Minimum Number of Offline BWS Sets  <!-- (econ: reorder point) -->
        </label>
        <input id="queue-reorderpoint" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="queue_reorderpoint" step="1" min="1" max="20">
        <output for="queue-reorderpoint">{{ queue_reorderpoint }}</output>
      </div>

      <div class="field">
        <label class="label" for="queue-orderquantity">
          Number of BWS Sets to Reload  <!-- (econ: order quantity) -->
        </label>
        <input id="queue-orderquantity" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="queue_orderquantity" step="5" min="10" max="50">
        <output for="queue-orderquantity">{{ queue_orderquantity }}</output>
      </div>

    </div>
  </div>


  <h2 class="subtitle is-4">Sampling of Sentence Examples from the Database</h2>  <!-- Stichprobe der Satzbelege aus der Datenbank -->
  <div class="content">
    <p v-if="language == 'de'">
      In der Datenbank sind für gegebene Suchparameter (z.B. Lemma) i.d.R. eine sehr große Anzahl von Satzbelegen vorhanden, die nicht alle angezeigt werden können.
      Abhängig vom aktuellen globalen Score werden die besten N Satzbelege betrachten, um eine Stichprobe zu entnehmen.
      Desweiteren kann ein Offset für die nächstenbesten Satzbelege definiert werden, d.h. <code>[1+offset, N+offset]</code>. So können bspw. die bestbewerteten Satzbelege ausgeschlossen werden.
      
    </p>
    <p v-else>
      For given search parameters (e.g. Lemma) there is usually a very large number of sentence examples in the database, all of which cannot be displayed.
      N sentence example with the best current globals score form a pool to sample from.
      Furthermore, an offset can be defined for the next best sentence examples as pool, i.e. <code>[1+offset, N+offset]</code>. In this way, the best scored sentence example can be excluded.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
    
      <div class="field">
        <label class="label" for="item-sampling-numtop">
          Sample from N top scored sentences (Default: 100)
        </label>
        <input id="item-sampling-numtop" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="item_sampling_numtop" step="10" min="10" max="10000">
        <output for="item-sampling-numtop">{{ item_sampling_numtop }}</output>
      </div>

      <div class="field">
        <label class="label" for="item-sampling-offset">
          Offset (Default: 0)
        </label>
        <input id="item-sampling-offset" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="item_sampling_offset" step="100" min="0" max="100000">
        <output for="item-sampling-offset">{{ item_sampling_offset }}</output>
      </div>

    </div>
  </div>


  <h2 class="subtitle is-4">BWS Sets Configuration</h2>  <!-- BWS-Gruppen Konfiguration -->
  <div class="content">
    <p v-if="language == 'de'">
      In der BWS UI können 3 bis 5 Beispiele angezeigt werden. Die Anzahl sollte sich nach dem benötigten Arbeitsgedächtnis für die Bewertungsaufgabe richten, z.B. die Komplexität und Neuheit der Inhalte und Entscheidungskriterien, Fähigkeit sich auf alle angezeigten Beispielen gleichzeitig zu fokussieren, kognitive Erschöpfung (Siehe <a href="https://osf.io/qkxej/">Kap. 3</a>).
      <br>
      Um logische Inferenzregeln in der Datenanalyse anzuwenden, müssen BWS-Gruppen überlappend zusammengestellt werden. Zusätzlich kannst du sicherstellen, dass jeder Satzbeleg in mindestens zwei BWS-Gruppen vorkommt (Siehe <a href="https://osf.io/qkxej/">Kap. 5</a>).
    </p>
    <p v-else>
      The BWS UI can display between 3 and 5 items. The number should depends on the required working memory for the judgement, e.g. the complexity and newness of the content and decision criterias, ability to focus attention on all items, cognitive exhaustion levels (see <a href="https://osf.io/qkxej/">Ch. 3</a>).
      <br>
      In order to apply logical inference rules in post-processing, BWS sets need to be sampled in an overlapping manner. Additionally you can ensure that each sentence example occurs in at least two BWS sets (see <a href="https://osf.io/qkxej/">Ch. 5</a>).
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="bwsset-num-items">
          Items per BWS set (Default: 4)
        </label>
        <input id="bwsset-num-items" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="bwsset_num_items" step="1" min="3" max="5">
        <output for="bwsset-num-items">{{ bwsset_num_items }}</output>
      </div>

      <BDropdown idname="bwsset-sampling-method" 
                 labeltext="BWS sampling method" 
                 v-model:selected="bwsset_sampling_method" 
                 :options="[
                  {'id': 'overlap', 'text': 'overlap'}, 
                  {'id': 'twice', 'text': 'twice'}]" />

    </div>
  </div>


  <h2 class="subtitle is-4">Sampling from Local Pool (v4)</h2>
  <div class="content">
    <p v-if="language == 'de'">
      Vor dem erneuten Training des lokalen ML-Modells in der Interactivity BWS UI (v4), wird eine bestimmte Anzahl an BWS-Gruppen den Benutzer zur Bewertung vorgelegt.
      <br>
      Die Satzbelege können auf unterschiedliche Weise aus dem Pool ausgewählt werden, z.B. per Zufall
    </p>
    <p v-else>
      Before re-training the local ML model in the Interactivity BWS UI (v4), a specific number of BWS groups is presented to the user for evaluation.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="interactivity-num_preload_bwssets">
          Number of BWS sets to evaluate before re-training (Default: 3)
        </label>
        <input id="interactivity-num_preload_bwssets" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="num_preload_bwssets" step="1" min="1" max="20">
        <output for="interactivity-num_preload_bwssets">{{ num_preload_bwssets }}</output>
      </div>

      <BDropdown idname="interactivity-item-sampling-method" 
                 labeltext="Sampling Sentences from Pool (Default: semantic-similar)" 
                 v-model:selected="item_sampling_method" 
                 :options="[
                  {'id': 'random', 'text': 'random'}, 
                  {'id': 'exploit', 'text': 'exploit'},
                  {'id': 'newer', 'text': 'newer'},
                  {'id': 'unstable', 'text': 'unstable'},
                  {'id': 'newer-unstable', 'text': 'newer-unstable'},
                  {'id': 'semantic-similar', 'text': 'semantic-similar'}]" />

      <div class="field">
        <label class="label" for="interactivity-txtlen_noise">
          Noise when sorting examples by text length (Default: 10%)
        </label>
        <input id="interactivity-txtlen_noise" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="txtlen_noise" step=".01" min="0.0" max=".99">
        <output for="interactivity-txtlen_noise">{{ parseInt(txtlen_noise * 100.) }}</output>
      </div>

      
    </div>
  </div>


  <h2 class="subtitle is-4">Drop and/or Hide Examples if shown too often</h2>
  <div class="content">
    <p>
      We can specify a threshold of the maximum of times an examples is displayed to an user.
      On a first level, the example is <b>excluded from the BWS sampling process</b>, 
      i.e. the example remains in the pool but is not shown anymore -- 
      This option would prevent replenishing the pool automatically 
      (i.e. adding new examples from the database).
      The second option is to <b>remove the example from the pool</b> for good.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <input id="interactivity-exclude-bwssampling-toogle" 
               class="switch is-rounded" type="checkbox"
               v-model="exclude_max_display">
        <label class="label" for="interactivity-exclude-bwssampling-toogle">
          Exclude from BWS sampling if shown too often (Default: On)
        </label>
      </div>

      <div class="field">
        <input id="interactivity-drop-display-toogle" 
               class="switch is-rounded" type="checkbox"  
               v-model="drop_max_display">
        <label class="label" for="interactivity-drop-display-toogle">
          Drop examples from the pool if shown too often (Default: Off)
        </label>
      </div>

      <div class="field" v-show="exclude_max_display === true || drop_max_display === true">
        <label class="label" for="max-displays">
          Maximum number of times an example will be displayed
        </label>
        <input id="max-displays" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="max_displays" step="1" min="1" max="30">
        <output for="max-displays">{{ max_displays }}</output>
      </div>

    </div>
  </div>


  <h2 class="subtitle is-4">Pool Size (v4)</h2>
  <div class="content">
    <p v-if="language == 'de'">
      Die Poolgröße der lokal gespeicherten Satzbelege, Merkmalsvektoren, usw. muss eingeschränkt werden, da Endbenutzergeräte begrenzte Speicherkapazitäten haben.
    </p>
    <p v-else>
      The pool size of the locally stored sentences, feature vectors, annotation data, etc. must be constrained as end user devices have limited storage capacities.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="min-pool-size">
          Minimum Pool Size
        </label>
        <input id="min-pool-size" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="min_pool_size" step="10" min="10" max="1000">
        <output for="min-pool-size">{{ min_pool_size }}</output>
      </div>

      <div class="field">
        <label class="label" for="interactivity-max_pool_size">
          Maximum Pool Size
        </label>
        <input id="interactivity-max_pool_size" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="max_pool_size" step="10" min="20" max="1000">
        <output for="interactivity-max_pool_size">{{ max_pool_size }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">Only Load An Initial Pool Once</h2>
  <div class="content">
    <p>
      This option disable the automatic replenishment of the pool after examples were dropped.
      There are three scenarios.
      a) The pool never changes, i.e. no pool deletions, no pool additions.
      b) The pool shrinks, i.e. pool deletions but no pool additions.
      c) The pool renew itself, i.e. pool deletions and pool additions.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <div class="field">
        <input id="interactivity-add-only-initially-toogle" 
               class="switch is-rounded" type="checkbox"   
               v-model="initial_load_only">
        <label class="label" for="interactivity-add-only-initially-toogle">
          Only load an initial fixed pool / No pool additions lateron (Default: On)
        </label>
      </div>
    </div>
  </div>

  <h2 class="subtitle is-4">Drop and/or Add Examples by Training Score Distribution</h2>
  <div class="content">
    <p>
      In order to drop examples from the pool, or add new examples to the pool,
      a target training score distribution can be set 
      by specifying the bin edges and desired densities.
      If too many examples fall in a bin, equally the oldest and most coverged examples are removed from the pool.
      If too few examples fann in a bin, examples with a certain score range are queried from the database server and added to the pool.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="interactivity-bin_edges">
          Bin Edges
        </label>
        <input id="interactivity-bin_edges" 
               class="input" type="text" v-model="bin_edges_text">
      </div>

      <div class="field">
        <label class="label" for="interactivity-target_probas">
          Target Densities for each bin
        </label>
        <input id="interactivity-target_probas" 
               class="input" type="text" v-model="target_probas_text">
      </div>

      <div class="field">
        <input id="interactivity-drop-distribution-toogle" 
               class="switch is-rounded" type="checkbox"  
               v-model="drop_distribution">
        <label class="label" for="interactivity-drop-distribution-toogle">
          Drop examples from the pool by a target distribution (Default: Off)
        </label>
      </div>

      <div class="field">
        <input id="interactivity-add-distribution-toogle" 
               class="switch is-rounded" type="checkbox"  
               v-model="add_distribution">
        <label class="label" for="interactivity-add-distribution-toogle">
          Add examples to the pool by a target distribution (Default: Off)
        </label>
      </div>

    </div>
  </div>


  <h2 class="subtitle is-4">Drop Examples with Converged Model Scores</h2>
  <div class="content">
    <p>
      Ideally model scores converge for all examples.
      However, the model should converge to the correct scores.
      We could drop the examples from the pool if we suspect that the model is trapped in a local minima, i.e. we believe that most converged scores are wrong.
      Under normal circumstances, especially converged examples should remain within the pool.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <input id="interactivity-drop-converge-toogle" 
               class="switch is-rounded" type="checkbox"
               v-model="drop_converge">
        <label class="label" for="interactivity-drop-converge-toogle">
          Drop examples from pool if model score converged (Default: Off)
        </label>
      </div>

      <div class="field" v-show="drop_converge === true">
        <label class="label" for="interactivity-eps_score_change">
          Termination criteria: Model score changes
        </label>
        <input id="interactivity-eps_score_change" 
               class="input" type="text" v-model="eps_score_change_text">
      </div>

      <div class="field" v-show="drop_converge === true">
        <label class="label" for="interactivity-converge_patience">
          Patience. Number of model evaluations to wait before applying the convergence deletion criteria.
        </label>
        <input id="interactivity-converge_patience" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="converge_patience" step="1" min="0" max="10">
        <output for="interactivity-converge_patience">{{ converge_patience }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">Drop Examples from Local Paired Comparison Matrix</h2>
  <div class="content">
    <p>
      When examples are dropped from the pool, 
      also delete the rows and columns of paired comparison matrix.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <div class="field">
        <input id="interactivity-drop-pairs-toogle" 
               class="switch is-rounded" type="checkbox"   
               v-model="drop_pairs">
        <label class="label" for="interactivity-drop-pairs-toogle">
          Drop examples from local pairs matrix
        </label>
      </div>
    </div>
  </div>



  <h2 class="subtitle is-4">Trigger Re-Training</h2>
  <div class="content">
    <p>
      Set the number of BWS set evaluations to wait till a model re-training is triggered.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="retrain-patience">
          Re-Train patiences
        </label>
        <input id="retrain-patience" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="retrain_patience" step="1" min="1" max="20">
        <output for="retrain-patience" style="width:3.1rem;">{{ retrain_patience }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">Update Training Scores</h2>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <BDropdown idname="smoothing-method" 
                 labeltext="Smooting Methods to compute training scores" 
                 v-model:selected="smoothing_method" 
                 :options="[
                  {'id': 'last', 'text': 'last'}, 
                  {'id': 'ema', 'text': 'EMA'}]" />

      <div class="field">
        <label class="label" for="ema-alpha">
          alpha parameter (EMA)
        </label>
        <input id="ema-alpha" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="ema_alpha" step="0.01" min="0.0" max="1.0">
        <output for="ema-alpha" style="width:3.1rem;">{{ ema_alpha }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">Train Local ML Model</h2>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      
      <BDropdown idname="train-optimizer" labeltext="Optimization Algorithm" 
                 v-model:selected="train_optimizer" 
                 :options="[
                  {'id': 'adam', 'text': 'ADAM'}, 
                  {'id': 'rmsprop', 'text': 'RMSProp'},
                  {'id': 'adagrad', 'text': 'AdaGrad'},
                  {'id': 'sgd', 'text': 'SGD'}]" />

      <div class="field">
        <label class="label" for="train-lrate">
          Learning Rate
        </label>
        <input id="train-lrate" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="train_lrate" step="0.001" min="0.0" max="0.1">
        <output for="train-lrate" style="width:3.5rem;">{{ train_lrate }}</output>
      </div>

      <div class="field">
        <label class="label" for="train-epochs">
          Number of Epochs per Training Cycle
        </label>
        <input id="train-epochs" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="train_epochs" step="1" min="1" max="20">
        <output for="train-epochs" style="width:3.1rem;">{{ train_epochs }}</output>
      </div>

      <BDropdown idname="train-loss" labeltext="Loss Function" 
                 v-model:selected="train_loss" 
                 :options="[
                  {'id': 'meanSquaredError', 'text': 'MSE'}, 
                  {'id': 'huberLoss', 'text': 'Huber'},
                  {'id': 'absoluteDifference', 'text': 'Abs. Diff.'}]" />


      <div class="field">
        <label class="label" for="train-minsample">
          Mimimum Sample Size
        </label>
        <input id="train-minsample" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="train_minsample" step="1" min="5" max="100">
        <output for="train-minsample" style="width:3.1rem;">{{ train_minsample }}</output>
      </div>

    </div>
  </div>

</template>


<script>
import { useI18n } from 'vue-i18n';
import { defineComponent, watch, ref } from 'vue';
// import { useInteractivity } from '@/components/bestworst/interactivity.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import BDropdown from "@/components/layout/BDropdown.vue";


export default defineComponent({
  name: "BwsSettings",

  components: {
    BDropdown
  },

  setup(){
    // i18n data
    const { t } = useI18n();
    const { language } = useGeneralSettings();

    const {
      // also used in bestworst3
      queue_reorderpoint, 
      queue_orderquantity, 
      item_sampling_numtop, 
      item_sampling_offset,
      // Settings for (1) and (2)
      initial_load_only,
      min_pool_size, 
      max_pool_size,
      drop_distribution, 
      add_distribution, 
      bin_edges, 
      target_probas, 
      // Settings for (1) and (3)
      drop_max_display, 
      exclude_max_display, 
      max_displays, 
      // Settings for (1)
      drop_converge, 
      eps_score_change,
      converge_patience,
      drop_pairs,
      // Settings for (3)
      bwsset_num_items, 
      num_preload_bwssets, 
      bwsset_sampling_method, 
      item_sampling_method,
      txtlen_noise,
      // Settings for 4/5/6
      retrain_patience,
      // Settings for (5), e.g. computeTrainingScores
      smoothing_method, 
      ema_alpha,
      // Settings for (6): retrainModel
      train_optimizer,
      train_lrate, 
      train_epochs,
      train_loss,
      train_minsample
    } = useBwsSettings();

    watch(min_pool_size, (minsz) => {
      max_pool_size.value = (max_pool_size.value <= parseInt(minsz)) ? (parseInt(minsz) + 1) : max_pool_size.value
    });
    watch(max_pool_size, (maxsz) => {
      min_pool_size.value = (min_pool_size.value >= parseInt(maxsz)) ? (parseInt(maxsz) - 1) : min_pool_size.value
    })

    const bin_edges_text = ref(bin_edges.value.join());
    watch(bin_edges_text, (txt) => {
      bin_edges.value = txt.split(",").map(e => Number(e)).sort();
      // nconsole.log(bin_edges.value)
    });

    const target_probas_text = ref(target_probas.value.join(","));
    watch(target_probas_text, (txt) => {
      target_probas.value = txt.split(",").map(e => Number(e)).sort();
      //console.log(target_probas.value)
    });

    const eps_score_change_text = ref(
      Number.parseFloat(eps_score_change.value).toExponential(1))
    watch(eps_score_change_text, (txt) => {
      eps_score_change.value = Number.parseFloat(txt);
    });


    return { 
      t, language,
      queue_reorderpoint, queue_orderquantity, 
        item_sampling_numtop, item_sampling_offset,
      min_pool_size, max_pool_size, 
        initial_load_only,
        drop_distribution, add_distribution, bin_edges_text, target_probas_text, 
        exclude_max_display, drop_max_display, max_displays, 
        drop_converge, eps_score_change_text, converge_patience,
        drop_pairs,
      bwsset_num_items, num_preload_bwssets, bwsset_sampling_method, item_sampling_method, txtlen_noise,
      retrain_patience,
        smoothing_method, ema_alpha,
        train_optimizer, train_lrate, train_epochs, train_loss, train_minsample
    }
  }
});
</script>

