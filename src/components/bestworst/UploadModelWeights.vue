<template>
  <!-- input field -->
  <div class="file has-name is-boxed is-warning">
    <label class="file-label">
      <input 
        class="file-input" type="file" name="resume"
        @change="onFileChanged($event)"
        accept=".json,application/json" capture
      >
      <span class="file-cta">
        <span class="file-icon">
          <i class="fas fa-upload"></i>
        </span>
        <span class="file-label">
          Choose a file…
        </span>
      </span>
      <span class="file-name" v-show="fileName">
        {{ fileName }}
      </span>
    </label>
  </div>
  <!-- submit, i.e. overwrite model -->
  <br/>
  <div class="field" v-show="fileName">
    <p class="control">
      <button 
        class="button is-rounded is-danger" 
        v-on:click="overwriteModelWeights()"
      >
        <span class="icon"><i class="fas fa-file-edit"></i></span>
        <strong>Overwrite Model</strong>
      </button> 
    </p>
  </div>
  <!-- status message -->
  <p class="is-size-7 has-text-success-dark" v-if="msgStatus">
    <span class="icon">
      <i class="fas fa-check"></i>
    </span>
    <span>
      {{ msgStatus }}
    </span>
  </p>

</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useInteractivity } from '@/components/bestworst/interactivity.js';
import * as tf from '@tensorflow/tfjs';


export default defineComponent({
  name: 'UploadModelWeights',

  setup(){
    const file = ref(null);
    const fileName = computed(() => file.value?.name);
    // const fileExtension = computed(() => fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1));
    // const fileMimeType = computed(() => file.value?.type);
    const msgStatus = ref(undefined)

    const { 
      getTfjsModel, 
      saveModelWeights 
    } = useInteractivity();

    const onFileChanged = (event) => {
      file.value = event.target.files[0];
    };

    const overwriteModelWeights = async () => {
      // read weights
      const reader = new FileReader();
      reader.readAsText(file.value);
      reader.onload = async () => {
        // parse json
        const jsonWgts = JSON.parse(reader.result);
        // convert to tfjs weights
        let wgts = []
        jsonWgts.forEach((wgt) => {
          wgts.push(tf.tensor(Array.from(wgt["values"]), wgt["shape"]));
        });
        // overwrite model
        getTfjsModel().then((model) => {
          model.setWeights(wgts);
          // save model locally and in Cassandra
          model.save('indexeddb://user-specific-scoring-model');
          saveModelWeights(model);
          // confirmation message
          msgStatus.value = `Model weights updated with '${fileName.value}'`
          file.value = null
        });
      }
    }



    return { 
      onFileChanged,
      fileName,
      overwriteModelWeights,
      msgStatus,
    }
  }
});
</script>