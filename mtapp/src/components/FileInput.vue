<template>
  <v-card>
    <v-container fluid align="center">
      <v-row align="center">
        <v-col class="text-center">
          <div
            @drop.prevent="onDrop($event)"
            @dragover.prevent="dragInProgress = true"
            @dragenter.prevent="dragInProgress = true"
            @dragleave.prevent="dragInProgress = false"
            :class="{
              'simple-border-div': !dragInProgress,
              'drag-on-div': dragInProgress,
            }"
          >
            <div :hidden="fileLoaded" class="drop-info" id="dropInfo">
              Įtempkite failą
            </div>
            <v-file-input
              id="fileInput"
              outlined
              dense
              hide-details
              show-size
              truncate-length="50"
              @change="fileChange"
              :value="file"
              label="Audio failas"
              accept=".wav"
            ></v-file-input>
            <audio
              id="audio"
              :src="audioURL"
              controls
              :hidden="!fileLoaded"
              class="audio-control"
            ></audio>
          </div>
          <div class="combo-button-div">
            <div class="combo-div">
              <v-autocomplete
                v-model="selInstrument"
                :items="instruments"
                label="Instrumentas"
                outlined
                dense
                hide-details
                item-text="value"
                item-value="id"
                @change="updateControls"
              ></v-autocomplete>
            </div>
            <div class="button-div">
              <v-btn
                id="transcribeButton"
                dense
                color="primary"
                hide-details
                :disabled="!canTranscribe || working"
                v-on:click="transcribe"
                x-large
                >Transkribuoti</v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { bus } from '../service/bus';
import Transcriber from '../service/transcriber';

const service = new Transcriber();

export default {
  name: 'FileInput',
  data() {
    return {
      file: null,
      dragInProgress: false,
      selInstrument: 'clarinet',
      instruments: [
        { id: 'flute', value: 'Fleita' },
        { id: 'clarinet', value: 'Klarnetas' },
        { id: 'saxophone', value: 'Saxofonas' },
        { id: 'trumpet', value: 'Trimitas' },
      ],
      audioURL: '',
      canTranscribe: false,
      fileLoaded: false,
      working: false,
    };
  },
  mounted() {
    this.updateControls();
  },
  methods: {
    fileChange(file) {
      if (file && this.extensionOK(file)) {
        this.file = file;
        this.audioURL = window.URL.createObjectURL(file);
      } else {
        this.file = null;
        this.audioURL = '';
      }
      this.updateControls();
    },
    onDrop(e) {
      this.dragInProgress = false;
      if (e.dataTransfer.files.length > 0) {
        this.fileChange(e.dataTransfer.files[0]);
      } else {
        this.fileChange(null);
      }
    },
    updateControls() {
      this.canTranscribe = this.file !== null && (this.selInstrument || '') !== '';
      this.fileLoaded = this.file !== null && this.file !== undefined;
    },
    transcribe() {
      this.working = true;
      bus.$emit('onStart', {});
      service
        .transcribe(this.file, this.selInstrument)
        .then((r) => {
          const d = r.data;
          if ((d.error || '') !== '') {
            bus.$emit('onTranscribe', { error: d.error });
          } else {
            const data = atob(d.musicXML);
            bus.$emit('onTranscribe', { data });
          }
        })
        .catch((e) => {
          bus.$emit('onTranscribe', { error: e });
        })
        .then(() => {
          this.working = false;
        });
    },
    extensionOK(f) {
      const wavExt = /(\.wav)$/i;
      const res = wavExt.exec(f.name);
      return res !== null && res.length !== 0;
    },
  },
};
</script>

<style lang="scss">
.audio-control {
  width: 100%;
  padding-top: 10px;
}

.button-div {
  // width: 100%
  padding-top: 10px;
  margin-left: auto;
  text-align: left;
  margin-right: 0px;
}

.combo-div {
  width: 100%;
  // max-width: 250px
  padding-top: 10px;
  padding-right: 10px;
}

.drop-info {
  font-size: 110%;
  font-style: italic;
  padding-bottom: 10px;
}

.simple-border-div {
  margin: 2px;
  padding: 2px;
  width: 100%;
  max-width: 500px;
}

.drag-on-div {
  border: solid 2px #3f51b5;
  border-radius: 4px;
  margin: 2px;
  padding: 2px;
  width: 100%;
  max-width: 500px;
}

.combo-button-div {
  text-align: right;
  align-items: center;
  display: flex;
  width: 100%;
  max-width: 500px;
}
</style>
