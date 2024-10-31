<template>
  <v-container>
    Coupons

    <v-card
      :key="'game' + game.id"
      class="mx-auto mb-3"
      max-width="344"
      style="width: 100%"
      v-for="game in gamifications"
    >
      <gamificationItem
        :titleObject="{ title: 'Your Title Here' }"
        :gamification="game"
        :company="company"
      />
    </v-card>

    <!-- <v-card> -->
    <!-- <invite /> -->
    <!-- </v-card> -->
  </v-container>
</template>
<script>
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
// import alert from "@/components/shared/errorAlert"
import gamificationItem from "../gamifications/gamificationItem.vue"
import auth from "@/core/auth"
// import invite from "@/views/home/tasks/invitefriend"
export default {
  components: {
    gamificationItem,
    // alert,
    // invite,
  },
  data() {
    return {
      gamifications: [],
      showGames: false,
    }
  },
  created() {
    this.loadGamifications()
    this.company = companyconfig.getCompanyIdfromUrl()
  },
  async mounted() {},
  methods: {
    /**
     * Get list of gamifications
     */
    loadGamifications() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getGamification(passedCompanyId, token)
        .then((result) => {
          let response = result.data
          this.gamifications = response.data
          this.showGames = true
        })
        .catch((err) => {
          this.showGames = false
          let errormsg = err.data.message
          if (errormsg === "NO_GAMIFICATIONS_FOUND") {
            console.error(errormsg)
          }
        })
    },
  },
}
</script>
