<template>
  <v-card flat tile :style="{ background: '#fff0' }">
    <v-toolbar flat dense :color="config.mcolor">
      <v-toolbar-title
        v-text="$t('History.HISTORY')"
        style="color: white"
      ></v-toolbar-title>
    </v-toolbar>

    <v-tabs
      v-model="tab"
      fixed-tabs
      color="blue-grey lighten-3"
      :style="{ backgroundColor: `${config.innercolor} !important` }"
    >
      <v-tab
        :style="{
          backgroundColor: `${config.innercolor} !important`,
          color: 'white',
        }"
        value="receipts"
      >
        {{ $t("History.RECEIPTS") }}
        <v-icon>mdi-receipt-text-check</v-icon>
      </v-tab>

      <v-tab
        :style="{
          backgroundColor: `${config.innercolor} !important`,
          color: 'white',
        }"
        value="awards"
      >
        {{ $t("History.AWARDS") }}
        <v-icon>mdi-gift</v-icon>
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="receipts"> <receipts /> </v-window-item>
      <v-window-item value="awards"> <purchases /> </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { ref, onMounted, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { NO_HISTORY, NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
import receipts from "../components/history/receiptsComponent.vue"
import purchases from "../components/history/purchasesComponent"

export default {
  components: {
    receipts,
    purchases,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const default_tab = "receipts"
    const history = ref([])
    const config = reactive({})
    const tab = ref("awards")
    const colors = [
      "cyan",
      "green",
      "purple",
      "amber",
      "pink",
      "teal",
      "indigo",
      "light-green",
      "light-blue",
      "blue-grey",
      "brown",
    ]
    const historyExists = ref(false)

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.mcolor = data.main_color
        config.mfontcolor = data.main_font_color
        config.innercolor = data.layout_background_color_inner
        config.outercolor = data.layout_background_color_outer
      }
    }

    const navigate = () => {
      router.go(-1)
    }

    const navigateHome = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    }

    const loadHistory = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getHistory(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          let items = response.data
          let data = []
          if (items.length != 0) {
            items.forEach((item) => {
              let obj = {}
              obj.mcolor = item.points < 0 ? "red" : "green"
              obj.points = item.points + " " + this.$t("AppScreen.POINTS")
              obj.type = getType(item.type)
              obj.date = item.date
              obj.color = colors[Math.floor(Math.random() * colors.length)]
              data.push(obj)
            })
            history.value = data
            historyExists.value = true
          } else {
            historyExists.value = false
          }
        })
        .catch((err) => {
          historyExists.value = false
          let errmsg = err.data?.message
          if (errmsg === NO_HISTORY) {
            console.log(err)
          } else if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    }

    const getType = (type) => {
      let op = ""
      switch (type) {
        case "S":
          op = this.$t("AppScreen.SURVEY_ANSWERED")
          break
        case "SV":
          op = this.$t("AppScreen.SURVEY_VIEWED")
          break
        case "BAR":
          op = this.$t("AppScreen.BARCODE_SCANNED")
          break
        case "RRU":
          op = this.$t("AppScreen.REGISTRATION_WITH_INVITE_CODE")
          break
        case "BAP":
          op = this.$t("AppScreen.BOUGHT_A_PRICE")
          break
      }
      return op
    }

    onMounted(() => {
      setupLayout()
      loadHistory()
      tab.value = route.query.tab || default_tab
    })

    return {
      default_tab,
      history,
      config,
      tab,
      colors,
      historyExists,
      setupLayout,
      navigate,
      navigateHome,
      loadHistory,
      getType,
    }
  },
}
</script>
