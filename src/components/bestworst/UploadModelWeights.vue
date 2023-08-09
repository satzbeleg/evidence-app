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

</template>

<script>
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: 'UploadModelWeights',

  // props: {
  //   text: String,
  //   biblio: String,
  //   size: String,
  // },

  setup(){
    const file = ref(null);
    const fileName = computed(() => file.value?.name);
    // const fileExtension = computed(() => fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1));
    // const fileMimeType = computed(() => file.value?.type);

    const onFileChanged = (event) => {
      file.value = event.target.files[0];
    };

    const overwriteModelWeights = async () => {
      // console.log(file.value);
      const reader = new FileReader();
      reader.readAsText(file.value);
      reader.onload = async () => {
        const wgts = JSON.parse(reader.result);
        console.log(wgts);
      }
    }

    return { 
      onFileChanged,
      fileName,
      overwriteModelWeights,
    }
  }
});
</script>