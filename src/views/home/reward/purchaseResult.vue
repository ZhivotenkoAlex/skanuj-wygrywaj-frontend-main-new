<template>
  <v-container>
    <v-row
      class="mb-6"
      :style="`background-color:${config.innercolor} !important`"
    >
      <div class="loader_container" v-if="!product.id && !purchase.id">
        <Loader />
      </div>
      <v-col v-else cols="12">
        <v-card class="mx-auto mt-12 mb-4" max-width="374">
          <v-img style="width: 100%" :src="product.picture"></v-img>
          <v-card-title class="card__title">{{ product.name }}</v-card-title>
          <v-card-text>
            <v-row align="center" class="mx-0 mb-4 text-center">
              <div
                v-if="product.allow_reservation === '1'"
                class="black--text content_center"
              >
                {{ $t("RewardsScreen.RESERVATION_SUCCESS") }}
              </div>
              <div v-else class="black--text">
                {{ $t("RewardsScreen.AN_ORDER") }}
                <strong>{{ purchase.id }}</strong>
                {{ $t("RewardsScreen.WAS_FILLED_ABOUT") }}
                {{ formatDate(purchase.cur_time) }}
                {{ getPurchaseBy(purchase) }}
              </div>

              <p
                v-if="purchase.bought_info"
                :style="`color:${config.mfontcolor} !important`"
                v-html="`${purchase.bought_info}`"
              ></p>
            </v-row>
          </v-card-text>
        </v-card>
        <template>
          <v-btn
            :style="`background-color:${config.mcolor}`"
            block
            @click="navigateHistory"
          >
            {{ $t("RewardsScreen.GO_TO_HISTORY") }}</v-btn
          >
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
// import { purchase } from "vue-gtag"
import Loader from "@/components/shared/loaderComponent.vue"

export default {
  data() {
    return {
      config: {},
      purchase: {},
      product: {},
    }
  },
  created() {
    this.setupLayout()
    this.loadPurchase()
    // this.loadReward()
  },
  methods: {
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "pcolor", data.primary_color)
        this.$set(this.config, "pfontcolor", data.primary_font_color)
        this.$set(this.config, "rewardLayout", data.rewardLayout)
        if (data.rewardLayout == "Cocacola") {
          this.$set(this.config, "marginright", "0px")
        } else if (data.rewardLayout == "PandD") {
          this.$set(this.config, "marginright", "16px")
          if (data.shadowDirection == "right") {
            this.$set(this.config, "shadowhOffset", data.shadowSize + "px")
            this.$set(this.config, "shadowvOffset", data.shadowSize + "px")
          } else if (data.shadowDirection == "left") {
            this.$set(this.config, "shadowhOffset", data.shadowSize * -1 + "px")
            this.$set(this.config, "shadowvOffset", data.shadowSize + "px")
          } else if (data.shadowDirection == "bottom") {
            this.$set(this.config, "shadowhOffset", data.shadowSize + "px")
            this.$set(this.config, "shadowvOffset", data.shadowSize + "px")
          } else if (data.shadowDirection == "top") {
            this.$set(this.config, "shadowhOffset", data.shadowSize + "px")
            this.$set(this.config, "shadowvOffset", data.shadowSize * -1 + "px")
          }
          this.$set(this.config, "shadowOpacity", data.shadowOpacity + "px")
          this.$set(this.config, "shadowcolor", data.shadowColor)
          this.$set(this.config, "shadowSize", data.shadowSize + "px")
          this.$set(
            this.config,
            "innercolor",
            data.layout_background_color_inner
          )
          this.$set(
            this.config,
            "outercolor",
            data.layout_background_color_outer
          )
        }
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      return date.toLocaleDateString("pl-PL", options)
    },
    navigateHistory() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "personalhistory",
        // params: { tab: "awards" },
        query: { company_name: passedCompanyId, tab: "awards" },
      })
    },
    loadPurchase() {
      let token = auth.getAccessToken()
      let id = companyconfig.getFieldValueFromUrl("id")
      api
        .getPurchase(token, id)
        .then((result) => {
          let response = result.data
          this.purchase = response.data
          this.loadReward(result.data.data.product_id)
        })

        .catch((err) => {
          let errmsg = err.data.message
          console.error(errmsg)
        })
    },
    loadReward(id) {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getReward(token, passedCompanyId, lang, id)
        .then((result) => {
          let response = result.data
          if (response.data) {
            let data = response.data[0]
            this.product = data
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },

    getPurchaseBy(purchase) {
      let r = ""
      if (purchase.need_accept != 2) {
        r = this.$t("RewardsScreen.WORTH") + " "
        purchase.price + " " + this.lang_points(purchase.price)
      }
      return r
    },
    lang_points(num, base, suffix_1, suffix_2, suffix_5) {
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
        base = this.$t("AppScreen.POINT")
        if (num === 1) return base
        else return base + "s" // warning: there might be exceptions to this rule
      }
    },
  },
  components: {
    Loader,
  },
}
</script>
<style scoped>
.loader_container {
  margin: 0 auto;
}

.content_center {
  margin: 0 auto;
}

.card__title {
  display: flex;
  justify-content: center;
}
</style>
