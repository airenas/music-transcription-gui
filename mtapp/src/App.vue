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
import FileInput from "./components/FileInput.vue";
import MusicXMLPlayer from "./components/MusicXMLPlayer.vue";

export default {
  name: "App",

  components: {
    FileInput,
    MusicXMLPlayer,
  },

  data: () => ({
    //
  }),
};
</script>
