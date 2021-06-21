<template>
  <v-app>
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

export default {
  name: 'App',

  components: {
    FileInput,
    MusicXMLPlayer,
  },
  mounted() {
    console.log('URL:', this.url);
    Transcriber.initURL(this.url);
  },
  beforeMount: function () {
    const el = document.getElementById('app');
    this.url = el.attributes['data-url'].value;
  },
  data: () => ({
    url: null
  }),
};
</script>
