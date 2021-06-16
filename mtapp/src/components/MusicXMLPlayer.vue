<template>
  <v-card>
    <div class="scores-div">
      <div class="text-center" v-if="working">
        <v-progress-circular
          color="primary"
          :size="70"
          :width="7"
          indeterminate
        ></v-progress-circular>
      </div>
      <div class="text-center" v-if="!working && error">
        <span class="error-span">{{ error }}</span>
      </div>
      <div class="text-center" :hidden="!file || working">
        <div class="buttons-div">
          <div class="action-start-div">
            <v-btn
              color="primary"
              elevation="2"
              v-on:click="play"
              :disabled="!canPlay"
              icon
            >
              <v-icon>{{ playOrPause }}</v-icon>
            </v-btn>
          </div>
          <div class="action-div">
            <v-btn
              elevation="2"
              v-on:click="stop"
              :disabled="!canStop"
              icon
              color="red"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>
          </div>
          <div class="save-div">
            <v-btn
              color="primary"
              elevation="2"
              v-on:click="save"
              :disabled="!file"
              icon
            >
              <v-icon>mdi-cloud-download</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="at-wrap">
          <div class="at-content">
            <div class="at-viewport" id="at-viewport">
              <div id="at-main" class="at-canvas"></div>
            </div>
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
      error: "",
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
      this.error = "";
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
      this.playOrPause = !this.playing ? "mdi-play" : "mdi-pause";
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

<style scoped>
.scores-div {
  padding-top: 5px;
  padding-bottom: 5px;
}
.buttons-div {
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  align-items: left;
  display: flex;
}
.action-start-div {
  text-align: left;
  margin-left: 40px;
  width: 48px;
}
.action-div {
  text-align: left;
  margin-left: 10px;
  width: 48px;
}
.save-div {
  text-align: left;
  margin-left: 40px;
  width: 64px;
}
.error-span{
  color: red;
  font-style: italic;
  font-size: 90%;
}
</style>
