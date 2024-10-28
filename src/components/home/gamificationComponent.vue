<template>
  <div class="root">
    <v-container class="red header">
      <v-btn
        class="red shadow white--text font text-h6"
        @click="goToReceiptGamification()"
      >
        <span class="pkt_button_title"> {{ buttonTitle }}</span>
      </v-btn>
      <div class="icon_container flex">
        <v-avatar size="70">
          <v-icon class="white" color="#000000cc" size="40px">{{
            GamificationIcons["SERV"]
          }}</v-icon>
        </v-avatar>
      </div>
    </v-container>
    <v-container>
      <p class="flex align-center text-body-1 mt-4">Zaproś znajomych</p>
      <!-- <p>{{ gamification.id }}</p> -->
    </v-container>
    <v-container class="red button_container">
      <v-btn
        class="red white--text font text-h6 btn"
        @click="goToReceiptGamification()"
      >
        <v-icon>mdi-chevron-double-down</v-icon>
        <span class="button_title">Zobacz więcej</span>
      </v-btn>

      <v-divider class="border-opacity-100" color="white" vertical></v-divider>

      <v-btn
        class="red white--text font text-h6 btn"
        @click="goToReceiptGamification()"
      >
        <v-icon>mdi-share-variant</v-icon>
        <span class="button_title">Zaproś</span>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import { GamificationIcons } from "@/appConstants"
export default {
  props: {
    titleObject: {
      type: Object,
      required: true,
    },
    gamification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    GamificationIcons() {
      return GamificationIcons
    },
    buttonTitle() {
      return `+ ${this.gamification.points} pkt.`
    },
  },
}
</script>
<style>
.root {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
}
.header {
  height: 60px;
}

.font {
  font-size: 16px;
  font-weight: 700;
}

.icon_container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
}
.button_container {
  display: flex;
  justify-content: space-between;
}

.btn {
  box-shadow: none;
  width: 45%;
}

.button_title {
  padding-bottom: 0px;
  text-transform: capitalize;
  font-size: 18px;
  font-weight: 700;
}

.pkt_button_title {
  padding-bottom: 0px;
  text-transform: lowercase;
  font-size: 18px;
  font-weight: 700;
}
</style>
