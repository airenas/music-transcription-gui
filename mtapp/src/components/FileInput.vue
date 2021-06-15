<template>
  <v-card>
    <div>
      <v-container fluid>
        <v-row align="center">
          <v-col class="text-center" cols="5">
            <div
              @drop.prevent="onDrop($event)"
              @dragover.prevent="dragInProgress = true"
              @dragenter.prevent="dragInProgress = true"
              @dragleave.prevent="dragInProgress = false"
              :class="{
                'simple-border': !dragInProgress,
                'drag-on': dragInProgress,
              }"
            >
              <div :hidden="fileLoaded">Įtempkite failą</div>
              <v-file-input
                outlined
                dense
                show-size
                truncate-length="50"
                @change="fileChange"
                :value="file"
                label="Audio failas"
                accept=".wav"
              ></v-file-input>
              <audio :src="audioURL" controls :hidden="!fileLoaded"></audio>
            </div>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col class="text-center" cols="12" sm="">
            <div class="my-2">
              <v-col cols="5">
                <v-combobox
                  v-model="selInstrument"
                  :items="instruments"
                  label="Instrumentas"
                  outlined
                  dense
                  @change="updateControls"
                ></v-combobox>
              </v-col>
            </div>
            <div class="my-2">
              <v-btn
                color="primary"
                :disabled="!canTranscribe || working"
                v-on:click="transcribe"
                >Transcribuoti</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script>
import { bus } from "../main";
import Transcriber from "../service/transcriber";

const service = new Transcriber();

export default {
  name: "FileInput",
  data() {
    return {
      file: null,
      dragInProgress: false,
      selInstrument: "Klarnetas",
      instruments: ["Fleita", "Klarnetas", "Saxofonas", "Trimitas"],
      audioURL: "",
      canTranscribe: false,
      fileLoaded: false,
      working: false,
    };
  },
  methods: {
    fileChange(file) {
      console.log("File", file);
      if (file && this.extensionOK(file)) {
        this.file = file;
        this.audioURL = window.URL.createObjectURL(file);
      } else {
        this.file = null;
        this.audioURL = "";
      }

      console.log("URL", this.audioURL);
      this.updateControls();
    },
    onDrop(e) {
      this.dragInProgress = false;
      console.log("File", e);
      if (e.dataTransfer.files.length > 0) {
        this.fileChange(e.dataTransfer.files[0]);
      } else {
        this.fileChange(null);
      }
    },
    updateControls() {
      console.log("Update", this.selInstrument);
      this.canTranscribe = this.file && this.selInstrument;
      this.fileLoaded = this.file && this.file !== undefined;
    },
    transcribe() {
      console.log("transcribe");
      this.working = true;
      bus.$emit("onStart", { });
      service
        .transcribe(this.file, this.selInstrument)
        .then((r) => {
          const d = r.data
          if ((d.error || "") !== "") {
            bus.$emit("onTranscribe", { error: d.error });
          } else {
            const data = atob(d.musicXML);
            bus.$emit("onTranscribe", { data: data });
          }
        })
        .catch((e) => {
          bus.$emit("onTranscribe", { error: e });
        })
        .then(() => {
          console.log("finish");
          this.working = false;
        });
    },
    extensionOK(f) {
      const wavExt = /(\.wav)$/i;
      return wavExt.exec(f.name);
    }
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/main.sass'

.simple-border
  border: solid 1px map-get($indigo, base)
  margin: 5px
  padding: 5px

.drag-on
  border: solid 2px map-get($indigo, base)
  margin: 5px
  padding: 5px
</style>
