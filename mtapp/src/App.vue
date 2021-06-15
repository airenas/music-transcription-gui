<template>
  <v-app>
    <v-main>
      <FileInput/>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-main>
  </v-app>
</template>

<script>
import FileInput from './components/FileInput.vue';

export default {
  name: 'App',

  components: {
    FileInput,
  },

  data: () => ({
    //
  }),
};
</script>
