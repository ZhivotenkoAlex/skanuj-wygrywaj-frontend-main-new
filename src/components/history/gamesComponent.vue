<template>
  <v-container>
    <v-row class="mb-6">
      <v-col cols="12" v-if="history.length > 0">
        <v-card
          :loading="loading"
          :key="'receipt' + receipt.id"
          class="mx-auto my-12 mb-4"
          max-width="374"
          v-for="receipt in history"
        >
          <template v-slot:progress>
            <v-progress-linear
              color="red"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img style="width: 100%" :src="game.picture"></v-img>

          <v-card-title class="text-wrap">{{ game.name }}</v-card-title>

          <v-card-text>
            <v-row align="center" class="mx-0">
              <div class="black--text ms-4"><strong>Data</strong>:</div>

              <div class="ms-4">
                {{ receipt.date }}
              </div>
            </v-row>
            <v-row align="center" class="mx-0">
              <div class="black--text ms-4"><strong>Status</strong>:</div>

              <div class="ms-4">You win {{ receipt.points }} points</div>
            </v-row>
          </v-card-text>
        </v-card>

        <template v-if="hasMore">
          <v-btn block @click="loadHistory"> Pokaż więcej zapisów </v-btn>
        </template>
      </v-col>
      <v-col cols="12" v-else>
        <v-card-title> Nie znaleziono zapisów </v-card-title>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { NO_HISTORY, NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"

export default {
  data() {
    return {
      history: [],
      game: [],
      hasMore: false,
      limit: 10,
      offset: 0,
      loading: true,
    }
  },
  created() {
    this.loadHistory()
  },
  methods: {
    loadHistory() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let instance = this
      api
        .getGamesHistory(
          token,
          passedCompanyId,
          instance.limit,
          instance.offset
        )
        .then((result) => {
          let response = result.data

          response.data.history.forEach((item) => {
            instance.history.push(item)
          })

          instance.game = response.data.product
          instance.hasMore = response.hasMore
          instance.offset += instance.limit
          instance.loading = false
        })
        .catch((err) => {
          this.historyExists = false
          let errmsg = err.data.message
          if (errmsg === NO_HISTORY) {
            console.log(err)
          } else if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
  },
}
</script>
<style scoped>
.text-wrap {
  word-break: break-word;
}
</style>
