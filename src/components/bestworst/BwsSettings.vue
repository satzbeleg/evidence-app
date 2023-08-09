<template>
  <h1 class="title is-3 is-spaced">{{ t('bestworst.title') }}</h1>


  <h2 class="subtitle is-4">{{ t('bestworst.setconfig.header') }}</h2>  <!-- BWS-Gruppen Konfiguration -->
  <div class="content">
    <p>
      <!-- {{ t('bestworst.setconfig.info1') }} -->
      <span v-html="t('bestworst.setconfig.info1')"></span>   <!-- hack to inject html for the meanwhile! possible dangerous -->
      <br>
      <!-- {{ t('bestworst.setconfig.info2') }} -->
      <span v-html="t('bestworst.setconfig.info2')"></span>   <!-- hack to inject html for the meanwhile! possible dangerous -->
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="bwsset-num-items">
          {{ t('bestworst.setconfig.items') }}
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



  <h2 class="subtitle is-4">{{ t('bestworst.poolsize.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.poolsize.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="min-pool-size">
          {{ t('bestworst.poolsize.minsize') }}
        </label>
        <input id="min-pool-size" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="min_pool_size" step="10" min="10" max="1000">
        <output for="min-pool-size">{{ min_pool_size }}</output>
      </div>

      <div class="field">
        <label class="label" for="interactivity-max_pool_size">
          {{ t('bestworst.poolsize.maxsize') }}
        </label>
        <input id="interactivity-max_pool_size" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="max_pool_size" step="10" min="20" max="1000">
        <output for="interactivity-max_pool_size">{{ max_pool_size }}</output>
      </div>

    </div>
  </div>


  <h2 class="subtitle is-4">{{ t('bestworst.localpool.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.localpool.info1') }}
      <br>
      {{ t('bestworst.localpool.info2') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="interactivity-num_preload_bwssets">
          {{ t('bestworst.localpool.number') }}
        </label>
        <input id="interactivity-num_preload_bwssets" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="num_preload_bwssets" step="1" min="1" max="20">
        <output for="interactivity-num_preload_bwssets">{{ num_preload_bwssets }}</output>
      </div>

      <BDropdown idname="interactivity-item-sampling-method" 
                :labeltext="t('bestworst.localpool.sampling')" 
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
          {{ t('bestworst.localpool.noise') }}
        </label>
        <input id="interactivity-txtlen_noise" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="txtlen_noise" step=".01" min="0.0" max=".99">
        <output for="interactivity-txtlen_noise">{{ parseInt(txtlen_noise * 100.) }}</output>
      </div>

      
    </div>
  </div>


  <h1 class="title is-3 is-spaced">TFJS Settings</h1>

  <h2 class="subtitle is-4">Download Current Model</h2>
  <div class="content">
    <p>
      Download the weights of the current model as JSON file.
      Use the 'value' key and 'shape' key to reconstruct a TF tensor or numpy array,
      and pass the list of tensors to Keras' <code>model.set_weights</code> method.
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <button class="button is-rounded is-link" 
              v-on:click="downloadModelWeights()">
        <span class="icon"><i class="fas fa-download"></i></span>
        <strong>Download</strong>
      </button> 
    </div>
  </div>

  <h2 class="subtitle is-4">Upload New Model</h2>
  <div class="content">
    <p>
      Upload the weights of a Keras model. 
      Convert the list of tensors to a list of dictionaries
      where the key 'values' contains a list of floating-point numbers,
      and 'shape' the shape of the tensor.
      WARNING: This will overwrite the current model!
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <UploadModelWeights />
    </div>
  </div>

  <h2 class="subtitle is-4">{{ t('bestworst.retrain.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.retrain.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="retrain-patience">
          {{ t('bestworst.retrain.patiences') }}
        </label>
        <input id="retrain-patience" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="retrain_patience" step="1" min="1" max="20">
        <output for="retrain-patience" style="width:3.1rem;">{{ retrain_patience }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">{{ t('bestworst.update.header') }}</h2>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <BDropdown idname="smoothing-method" 
                :labeltext="t('bestworst.update.smoothing')" 
                 v-model:selected="smoothing_method" 
                 :options="[
                  {'id': 'last', 'text': 'last'}, 
                  {'id': 'ema', 'text': 'EMA'}]" />

      <div class="field">
        <label class="label" for="ema-alpha">
          {{ t('bestworst.update.ewa') }}
        </label>
        <input id="ema-alpha" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="ema_alpha" step="0.01" min="0.0" max="1.0">
        <output for="ema-alpha" style="width:3.1rem;">{{ ema_alpha }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">{{ t('bestworst.localmodel.header') }}</h2>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      
      <BDropdown idname="train-optimizer"
                :labeltext="t('bestworst.localmodel.optimizer')" 
                 v-model:selected="train_optimizer" 
                 :options="[
                  {'id': 'adam', 'text': 'ADAM'}, 
                  {'id': 'rmsprop', 'text': 'RMSProp'},
                  {'id': 'adagrad', 'text': 'AdaGrad'},
                  {'id': 'sgd', 'text': 'SGD'}]" />

      <div class="field">
        <label class="label" for="train-lrate">
          {{ t('bestworst.localmodel.lr') }}
        </label>
        <input id="train-lrate" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="train_lrate" step="0.001" min="0.0" max="0.1">
        <output for="train-lrate" style="width:3.5rem;">{{ train_lrate }}</output>
      </div>

      <div class="field">
        <label class="label" for="train-epochs">
          {{ t('bestworst.localmodel.epochs') }}
        </label>
        <input id="train-epochs" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="train_epochs" step="1" min="1" max="20">
        <output for="train-epochs" style="width:3.1rem;">{{ train_epochs }}</output>
      </div>

      <BDropdown idname="train-loss" 
                :labeltext="t('bestworst.localmodel.loss')" 
                 v-model:selected="train_loss" 
                 :options="[
                  {'id': 'meanSquaredError', 'text': 'MSE'}, 
                  {'id': 'huberLoss', 'text': 'Huber'},
                  {'id': 'absoluteDifference', 'text': 'Abs. Diff.'}]" />


      <div class="field">
        <label class="label" for="train-minsample">
          {{ t('bestworst.localmodel.samplesize') }}
        </label>
        <input id="train-minsample" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="train_minsample" step="1" min="5" max="100">
        <output for="train-minsample" style="width:3.1rem;">{{ train_minsample }}</output>
      </div>

    </div>
  </div>


  <h1 class="title is-3 is-spaced">BWS v3 [deprecated]</h1>

  <h2 class="subtitle is-4">{{ t('bestworst.offline_queue.header') }}</h2>   <!-- Offline Warteschlange -->
  <div class="content">
    <p>
      {{ t('bestworst.offline_queue.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="queue-reorderpoint">
          {{ t('bestworst.offline_queue.min_number') }}  <!-- (econ: reorder point) -->
        </label>
        <input id="queue-reorderpoint" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="queue_reorderpoint" step="1" min="1" max="20">
        <output for="queue-reorderpoint">{{ queue_reorderpoint }}</output>
      </div>

      <div class="field">
        <label class="label" for="queue-orderquantity">
          {{ t('bestworst.offline_queue.reload_number') }}  <!-- (econ: order quantity) -->
        </label>
        <input id="queue-orderquantity" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="queue_orderquantity" step="5" min="10" max="50">
        <output for="queue-orderquantity">{{ queue_orderquantity }}</output>
      </div>

    </div>
  </div>


  <!-- 
    Stichprobe der Satzbelege aus der Datenbank 
    - `<span v-html ...` is a hack to inject html for the meanwhile! possible dangerous
    - Outdated Setting for bestworst3.vue and REST API `v1/bestworst/sampling`
  -->
  <h2 class="subtitle is-4">{{ t('bestworst.sampling.header') }}</h2>  
  <div class="content">
    <p>
      <span v-html="t('bestworst.sampling.info')"></span>
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
    
      <div class="field">
        <label class="label" for="item-sampling-numtop">
          {{ t('bestworst.sampling.n_top') }}
        </label>
        <input id="item-sampling-numtop" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="item_sampling_numtop" step="10" min="10" max="10000">
        <output for="item-sampling-numtop">{{ item_sampling_numtop }}</output>
      </div>
      <div class="field">
        <label class="label" for="item-sampling-offset">
          {{ t('bestworst.sampling.offset') }}
        </label>
        <input id="item-sampling-offset" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="item_sampling_offset" step="100" min="0" max="100000">
        <output for="item-sampling-offset">{{ item_sampling_offset }}</output>
      </div>
    </div>
  </div>





  <h1 class="title is-3 is-spaced">BWS v4 [experimental]</h1>
  <h2 class="subtitle is-4">{{ t('bestworst.drophide.header') }}</h2>
  <div class="content">
    <p>
      <!-- {{ t('bestworst.drophide.info') }} -->
      <span v-html="t('bestworst.drophide.info')"></span>   <!-- hack to inject html for the meanwhile! possible dangerous -->
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <input id="interactivity-exclude-bwssampling-toogle" 
               class="switch is-rounded" type="checkbox"
               v-model="exclude_max_display">
        <label class="label" for="interactivity-exclude-bwssampling-toogle">
          {{ t('bestworst.drophide.exclude') }}
        </label>
      </div>

      <div class="field">
        <input id="interactivity-drop-display-toogle" 
               class="switch is-rounded" type="checkbox"  
               v-model="drop_max_display">
        <label class="label" for="interactivity-drop-display-toogle">
          {{ t('bestworst.drophide.drop') }}
        </label>
      </div>

      <div class="field" v-show="exclude_max_display === true || drop_max_display === true">
        <label class="label" for="max-displays">
          {{ t('bestworst.drophide.maxnum') }}
        </label>
        <input id="max-displays" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="max_displays" step="1" min="1" max="30">
        <output for="max-displays">{{ max_displays }}</output>
      </div>

    </div>
  </div>



  <h2 class="subtitle is-4">{{ t('bestworst.initpool.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.initpool.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <div class="field">
        <input id="interactivity-add-only-initially-toogle" 
               class="switch is-rounded" type="checkbox"   
               v-model="initial_load_only">
        <label class="label" for="interactivity-add-only-initially-toogle">
          {{ t('bestworst.initpool.loadonce') }}
        </label>
      </div>
    </div>
  </div>

  <h2 class="subtitle is-4">{{ t('bestworst.trainscore.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.trainscore.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <label class="label" for="interactivity-bin_edges">
          {{ t('bestworst.trainscore.edges') }}
        </label>
        <input id="interactivity-bin_edges" 
               class="input" type="text" v-model="bin_edges_text">
      </div>

      <div class="field">
        <label class="label" for="interactivity-target_probas">
          {{ t('bestworst.trainscore.dens') }}
        </label>
        <input id="interactivity-target_probas" 
               class="input" type="text" v-model="target_probas_text">
      </div>

      <div class="field">
        <input id="interactivity-drop-distribution-toogle" 
               class="switch is-rounded" type="checkbox"  
               v-model="drop_distribution">
        <label class="label" for="interactivity-drop-distribution-toogle">
          {{ t('bestworst.trainscore.drop') }}
        </label>
      </div>

      <div class="field">
        <input id="interactivity-add-distribution-toogle" 
               class="switch is-rounded" type="checkbox"  
               v-model="add_distribution">
        <label class="label" for="interactivity-add-distribution-toogle">
          {{ t('bestworst.trainscore.add') }}
        </label>
      </div>

    </div>
  </div>


  <h2 class="subtitle is-4">{{ t('bestworst.converge.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.converge.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">

      <div class="field">
        <input id="interactivity-drop-converge-toogle" 
               class="switch is-rounded" type="checkbox"
               v-model="drop_converge">
        <label class="label" for="interactivity-drop-converge-toogle">
          {{ t('bestworst.converge.drop') }}
        </label>
      </div>

      <div class="field" v-show="drop_converge === true">
        <label class="label" for="interactivity-eps_score_change">
          {{ t('bestworst.converge.term') }}
        </label>
        <input id="interactivity-eps_score_change" 
               class="input" type="text" v-model="eps_score_change_text">
      </div>

      <div class="field" v-show="drop_converge === true">
        <label class="label" for="interactivity-converge_patience">
          {{ t('bestworst.converge.patience') }}
        </label>
        <input id="interactivity-converge_patience" 
               class="slider has-output is-fullwidth is-primary is-circle is-medium" 
               type="range" v-model="converge_patience" step="1" min="0" max="10">
        <output for="interactivity-converge_patience">{{ converge_patience }}</output>
      </div>

    </div>
  </div>

  <h2 class="subtitle is-4">{{ t('bestworst.matrix.header') }}</h2>
  <div class="content">
    <p>
      {{ t('bestworst.matrix.info') }}
    </p>
  </div>
  <div class="columns">
    <div class="column is-narrow-tablet is-narrow-desktop is-narrow-widescreen is-narrow-fullhd">
      <div class="field">
        <input id="interactivity-drop-pairs-toogle" 
               class="switch is-rounded" type="checkbox"   
               v-model="drop_pairs">
        <label class="label" for="interactivity-drop-pairs-toogle">
          {{ t('bestworst.matrix.drop') }}
        </label>
      </div>
    </div>
  </div>





</template>


<script>
import { useI18n } from 'vue-i18n';
import { defineComponent, watch, ref } from 'vue';
import { useInteractivity } from '@/components/bestworst/interactivity.js';
import { useBwsSettings } from '@/components/bestworst/bws-settings.js';
import { useGeneralSettings } from '@/components/settings/general-settings.js';
import BDropdown from "@/components/layout/BDropdown.vue";
import UploadModelWeights from '@/components/bestworst/UploadModelWeights.vue';

export default defineComponent({
  name: "BwsSettings",

  components: {
    BDropdown,
    UploadModelWeights
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

    const {
      downloadModelWeights,
    } = useInteractivity();


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
        train_optimizer, train_lrate, train_epochs, train_loss, train_minsample,
      downloadModelWeights
    }
  }
});
</script>

