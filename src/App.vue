<template>
  <v-app v-scroll="onScroll" style="margin: 0 auto; max-width: 750px" id="app">
    <RouterView></RouterView>
  </v-app>
</template>

<script>
import { defineComponent, onMounted } from "vue"
import { RouterView } from "vue-router"

export default defineComponent({
  name: "App",
  components: {
    RouterView,
  },
  setup() {
    const onScroll = () => {
      // Your scroll logic here
    }

    onMounted(() => {
      window.addEventListener("scroll", onScroll)
    })

    return {
      onScroll,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
