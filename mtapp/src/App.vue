<template>
  <v-app class="app-div">
    <v-main>
      <FileInput />
      <v-spacer></v-spacer>
      <MusicXMLPlayer />
    </v-main>
  </v-app>
</template>

<script>
import FileInput from './components/FileInput.vue';
import MusicXMLPlayer from './components/MusicXMLPlayer.vue';
import Transcriber from './service/transcriber';
import Version from './service/version';

export default {
  name: 'App',

  components: {
    FileInput,
    MusicXMLPlayer,
  },
  mounted() {
    console.log('URL    :', this.url);
    console.log('Version:', Version.buildVersion);
    Transcriber.initURL(this.url);
  },
  beforeMount() {
    const el = document.getElementById('app');
    this.url = el.attributes['data-url'].value;
  },
  data: () => ({
    url: null,
  }),
};
</script>

<style>
.v-application--wrap {
  min-height: auto !important;
}
.app-div {
  min-height: auto;
}
</style>
