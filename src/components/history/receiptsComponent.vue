<template>
  <v-container>
    <v-row class="mb-6" v-if="history.length > 0">
      <v-col cols="12">
        <v-card
          :key="'receipt' + receipt.id"
          class="mx-auto my-12 mb-1"
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

          <v-img style="width: 100%" :src="receipt.bill_image"></v-img>

          <v-card-text>
            <v-row align="center" class="mx-0">
              <div class="black--text ms-4">
                <strong>{{ $t("History.DATE") }}</strong
                >:
              </div>

              <div class="ms-4">
                {{ receipt.time_added }}
              </div>
            </v-row>
            <v-row align="center" class="mx-0">
              <div class="black--text ms-4">
                <strong>{{ $t("History.STATUS") }}</strong
                >:
              </div>

              <div class="ms-4" :style="{ color: getStatusColor(receipt) }">
                {{ getStatusText(receipt) }}
              </div>
            </v-row>
          </v-card-text>
        </v-card>

        <template v-if="hasMore">
          <v-btn block @click="loadHistory">
            {{ $t("History.MORE_RECORDS") }}
          </v-btn>
        </template>
      </v-col>
    </v-row>
    <v-row class="mb-6" v-else>
      <v-card-title> {{ $t("History.NO_RECORDS") }} </v-card-title>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue"
import { NO_HISTORY, NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"

export default {
  setup() {
    const history = ref([])
    const hasMore = ref(false)
    const limit = ref(10)
    const offset = ref(0)

    const loadHistory = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()

      api
        .getReceiptsHistory(token, passedCompanyId, limit.value, offset.value)
        .then((result) => {
          let response = result.data

          response.receipts.forEach((item) => {
            history.value.push(item)
          })

          hasMore.value = response.hasMore
          offset.value += limit.value
        })
        .catch((err) => {
          let errmsg = err.data.message
          if (errmsg === NO_HISTORY || errmsg === NO_COMPANY_FOUND) {
            console.log(err.data.message)
          }
        })
    }

    const getStatusColor = (receipt) => {
      let color = "#aba204"
      switch (receipt.is_success) {
        case "-1":
          color = "#f44336"
          break
        case "0":
          color =
            parseInt(receipt.marked_by_user_to_recheck) > 0
              ? "#aba204"
              : "#f44336"
          break
        case "2":
        case "1":
          color = "#00d415"
          break
      }
      return color
    }

    const getStatusText = (receipt) => {
      let status = ""
      switch (receipt.is_success) {
        case "-1":
          status = this.$t("History.STATUS_REJECTED")
          break
        case "0":
          status =
            parseInt(receipt.marked_by_user_to_recheck) > 0
              ? this.$t("History.STATUS_ON_VERIFICATION")
              : this.$t("History.STATUS_REJECTED")
          break
        case "2":
        case "1":
          status = this.$t("History.STATUS_ACCEPTED")
          break
      }
      return status
    }

    onMounted(() => {
      loadHistory()
    })

    return {
      history,
      hasMore,
      loadHistory,
      getStatusColor,
      getStatusText,
    }
  },
}
</script>

<style></style>
