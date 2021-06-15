<template>
  <v-card>
    <div class="simple">
      <div class="text-center">
        <v-progress-circular
          color="primary"
          :size="70"
          :width="7"
          indeterminate
          :hidden="!working"
        ></v-progress-circular>
      </div>
      <div class="text-center" :hidden="!file || working">
        <div class="at-wrap">
          <div class="at-content">
            <div class="at-viewport" id="at-viewport">
              <div id="at-main" class="at-canvas"></div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-center">
            <v-btn
              color="primary"
              elevation="2"
              v-on:click="play"
              :disabled="!canPlay"
            >
              {{ playOrPause }}</v-btn
            >
            <v-btn
              color="primary"
              elevation="2"
              v-on:click="stop"
              :disabled="!canStop"
              >Stop</v-btn
            >
            <v-btn
              color="primary"
              elevation="2"
              v-on:click="save"
              :disabled="!file"
              >Save</v-btn
            >
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { bus } from "../main";
import { saveAs } from "file-saver";

export default {
  name: "MusicXMLPlayer",
  data() {
    return {
      playOrPause: "Play",
      canPlay: false,
      canStop: false,
      playing: false,
      loading: false,
      working: false,
      file: null,
      at: null,
      publicPath: process.env.BASE_URL,
    };
  },
  created() {
    bus.$on("onTranscribe", (d) => {
      console.log("On transcribe");
      this.working = false;
      if ((d.error || "") !== "") {
        this.error = d.error;
        this.file = null;
      } else {
        console.log("Data", d.data);
        this.file = new File([d.data], "music.xml");
        this.setMusicXML(this.file);
      }
    });
    bus.$on("onStart", (d) => {
      console.log("On start");
      this.working = true;
    });
  },
  mounted() {
    this.at = this.setupControl();
  },
  methods: {
    setupControl() {
      const { updateControls } = this;
      const fontName = "Roboto";
      const atDiv = document.getElementById("at-main");
      console.log(atDiv);
      const viewPort = document.getElementById("at-viewport");
      console.log("viewPort", viewPort);
      const at = new alphaTab.AlphaTabApi(atDiv, {
        player: {
          scrollOffsetx: -10,
          enablePlayer: true,
          soundFont: `${this.publicPath}at/soundfont/sonivox.sf2`,
          scrollElement: viewPort,
        },
        display: {
          resources: {
            titleFont: `normal 32px ${fontName}, serif`,
            subTitleFont: `normal 20px ${fontName}, serif`,
            wordsFont: `normal 15px ${fontName}, serif`,
            effectFont: `italic 12px ${fontName}, serif`,
            fingeringFont: `normal 14px ${fontName}, serif`,
            markerFont: `bold 14px ${fontName}, serif`,
          },
        },
      });
      at.error.on((e) => {
        console.error("alphaTab error", e);
      });

      const trackItems = [];
      at.renderStarted.on((isResize) => {
        this.loading = true;
        updateControls();
        if (!isResize) {
          console.log("started loading");
        }
        const tracks = new Map();
        at.tracks.forEach((t) => {
          tracks.set(t.index, t);
        });

        trackItems.forEach((trackItem) => {
          if (tracks.has(trackItem.track.index)) {
            trackItem.classList.add("active");
          } else {
            trackItem.classList.remove("active");
          }
        });
      });

      at.renderFinished.on(() => {
        console.log("render finish");
        this.loading = false;
        updateControls();
      });
      at.scoreLoaded.on((score) => {
        console.log("score loaded");
        updateControls();
      });

      at.playerPositionChanged.on((args) => {});

      const playPauseButton = document.getElementById("play");
      at.playerReady.on(() => {
        console.log("player ready");
        updateControls();
      });

      at.playerStateChanged.on((e) => {
        console.log("stopped", e.stopped, e.state);
        this.playing = e.state == 1;
        if (!this.playing) {
          console.log("Stopped");
        } else {
          console.log("Playing");
        }
        updateControls();
      });
      return at;
    },
    play() {
      this.at.playPause();
    },
    save() {
      saveAs(this.file);
    },
    stop() {
      this.at.stop();
    },
    updateControls() {
      this.playOrPause = !this.playing ? "Play" : "Pause";
      this.canPlay = this.at && this.at.isReadyForPlayback && !this.loading;
      this.canStop = this.playing;
    },
    setMusicXML(file) {
      if (file) {
        const reader = new FileReader();
        const at = this.at;
        reader.onload = function (data) {
          at.load(data.target.result, [0]);
        };
        reader.readAsArrayBuffer(file);
      } else {
        this.at.load(null, [0]);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped >
@import '~vuetify/src/styles/main.sass'

.simple
  border: solid 1px map-get($indigo, base)
  margin: 5px
  padding: 5px
</style>
