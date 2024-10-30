<template>
  <v-container>
    <v-row class="mb-6" v-if="history.length > 0">
      <v-col cols="12">
        <v-card
          :key="'purchase' + purchase.id"
          class="mx-auto my-12 mb-4"
          max-width="374"
          v-for="purchase in history"
          style="background: #ffffffb3"
        >
          <template v-slot:progress>
            <v-progress-linear
              color="red"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img
            v-if="purchase.product"
            style="width: 100%"
            :src="getPicture(purchase)"
          ></v-img>
          <v-avatar v-else :size="300" style="width: 0%" color="#fff0">
            <v-icon class="white" :color="config.mfontcolor" :size="300">{{
              getPicture(purchase)
            }}</v-icon>
          </v-avatar>

          <v-card-title v-if="purchase.product">{{
            purchase.product.name
          }}</v-card-title>
          <v-card-title v-if="purchase.survey">{{
            purchase.survey.name
          }}</v-card-title>

          <v-card v-if="purchase.status === 'P'">
            <v-btn
              block
              :style="`background-color:${config.mcolor}`"
              @click="navigateapply(purchase.id)"
              >{{ $t("RewardsScreen.REDEEM_VOUCHER") }}
            </v-btn>
          </v-card>

          <v-card-text v-else>
            <v-row align="center" class="mx-0">
              <div class="black--text mb-4">
                {{ getDescription(purchase) }}
              </div>
              <div
                class="black--text"
                v-if="
                  purchase?.product?.bought_info.length > 0 &&
                  bought_info_statuses.includes(purchase.status)
                "
              >
                {{ purchase?.bought_info }}
              </div>

              <div class="black--text">
                {{ purchase?.bought_info }}
              </div>

              <p
                class="reward-history-address"
                v-if="
                  !purchase?.product?.is_virtual &&
                  purchase?.product?.need_accept == 0
                "
              >
                {{ $t("History.ORDER_ADDRESS") }}: {{ purchase?.full_address }}
              </p>
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
import { GamificationIcons } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
import { useI18n } from "vue-i18n"

export default {
  setup() {
    const { t } = useI18n()
    const history = ref([])
    const hasMore = ref(false)
    const limit = ref(10)
    const offset = ref(0)
    const config = ref({})
    const status_map = ref([])
    const bought_info_statuses = ref(["W", "S", "Z"])
    const companyName = ref("")

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.value.mcolor = data.main_color
        config.value.mfontcolor = data.main_font_color
      }
    }

    const loadHistory = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      companyName.value = passedCompanyId
      let token = auth.getAccessToken()
      api
        .getHistory(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          response.data.forEach((item) => {
            history.value.push(item)
          })

          status_map.value = response.status_map
          hasMore.value = response.hasMore
          offset.value += limit.value
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const getStatusColor = (receipt) => {
      let $color = "#aba204"
      switch (receipt.is_success) {
        case "-1":
          $color = "#f44336"
          break
        case "0":
          if (parseInt(receipt.marked_by_user_to_recheck) > 0) {
            $color = "#aba204"
          } else {
            $color = "#f44336"
          }
          break
        case "2":
        case "1":
          $color = "#00d415"
          break
      }
      return $color
    }

    const getStatusText = (receipt) => {
      let $status = ""
      switch (receipt.is_success) {
        case "-1":
          $status = t("History.STATUS_REJECTED")
          break
        case "0":
          if (parseInt(receipt.marked_by_user_to_recheck) > 0) {
            $status = t("History.STATUS_ON_VERIFICATION")
          } else {
            $status = t("History.STATUS_REJECTED")
          }
          break
        case "2":
        case "1":
          $status = t("History.STATUS_ACCEPTED")
          break
      }
      return $status
    }

    const getPicture = (purchase) => {
      let picture = ""
      if (purchase.type === "S") {
        picture = GamificationIcons["SURV"]
      }
      if (purchase.product) {
        picture = purchase.product.picture
      }
      return picture
    }

    const getDescription = (receipt) => {
      let $status = ""
      switch (receipt.type) {
        case "BH":
          $status = `${t("RewardsScreen.ORDER")} ${receipt.id} ${t(
            "RewardsScreen.WAS_FILLED_ABOUT"
          )} ${receipt.date} Company - ${companyName.value} ${getPurchaseBy(
            receipt
          )}`
          break
        case "S":
          $status = `${t("RewardsScreen.SURVEY_SUCCESS")} ${receipt.date} ${t(
            "RewardsScreen.COMPANY"
          )} - ${companyName.value}  ${getPurchaseBy(receipt)}`
          break
        case "GW":
          $status = `${t("RewardsScreen.GAME_WON")} ${receipt.date} ${t(
            "RewardsScreen.COMPANY"
          )} - ${companyName.value}  ${getPurchaseBy(receipt)}`
          break
      }
      return $status
    }

    const getPurchaseBy = (purchase) => {
      let r = ""
      if (purchase.type === "BH") {
        r =
          t("RewardsScreen.WORTH") +
          " " +
          purchase.points +
          " " +
          lang_points(purchase.points)
      } else {
        r =
          t("RewardsScreen.AND_RECEIVED") +
          " " +
          purchase.points +
          " " +
          lang_points(purchase.points)
      }
      return r
    }

    const lang_points = (num, base, suffix_1, suffix_2, suffix_5) => {
      let lang = auth.getAppLanguage()
      if (lang === "pl") {
        if (typeof base === "undefined") base = "punkt"
        if (typeof suffix_1 === "undefined") suffix_1 = ""
        if (typeof suffix_2 === "undefined") suffix_2 = "y"
        if (typeof suffix_5 === "undefined") suffix_5 = "ów"
        num = 1 * num
        var rnum = Math.round(num)
        if (num != rnum) return base + suffix_5 // fraction
        if (num == 0) return base + suffix_5
        if (num == 1) return base + suffix_1
        var last_num = num % 10
        if (last_num > 1 && last_num < 5 && (num < 10 || num > 20))
          return base + suffix_2
        else return base + suffix_5
      } else {
        base = t("AppScreen.POINT")
        if (num === 1) return base
        else return base + "s" // warning: there might be exceptions to this rule
      }
    }

    const navigateapply = (id) => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "applyreservation",
        params: { id: id },
        query: { company_name: passedCompanyId },
      })
    }

    onMounted(() => {
      setupLayout()
      loadHistory()
    })

    return {
      history,
      hasMore,
      limit,
      offset,
      config,
      status_map,
      bought_info_statuses,
      companyName,
      setupLayout,
      loadHistory,
      getStatusColor,
      getStatusText,
      getPicture,
      getDescription,
      getPurchaseBy,
      lang_points,
      navigateapply,
    }
  },
}
</script>

<style></style>
