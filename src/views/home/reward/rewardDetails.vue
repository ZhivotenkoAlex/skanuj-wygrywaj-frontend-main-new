<template>
  <div class="product-card-parent">
    <h3 class="product-card-user-title">Сześć {{ this.username }}!</h3>
    <div class="product-card-description-wrapper">
      <p class="product-card-description" v-html="product.description"></p>
    </div>
    <v-card flat tile>
      <v-toolbar
        dense
        :color="config.mcolor"
        :style="`color:${config.mfontcolor} !important`"
        flat
      >
        <v-btn
          icon
          class="border0px"
          @click="navigate"
          :style="`color:${config.mfontcolor} !important`"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title v-text="product.name"></v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-hover v-slot:default="{ hover }">
        <v-card>
          <v-img
            height="250"
            :src="product.picture"
            class="borderbtm1px product-card-image"
          >
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal display-3 primary lighten-4 white--text"
                style="height: 100%"
              >
                {{ product.price + " " + $t("AppScreen.BUY_POINTS") }}
              </div>
            </v-expand-transition>
          </v-img>
          <div class="product-card-warning-icon">!</div>
          <h4 class="product-card-warning">
            {{ $t("RewardsScreen.NO_BILL_REGISTERED") }}
          </h4>
          <v-card-text
            class="pt-6 product-card-buy-wrapper"
            style="position: relative"
          >
            <v-btn
              block
              @click="buyreward"
              :style="`color:${config.mfontcolor}`"
              class="product-card-buy"
              v-text="$t('AppScreen.BUY')"
            ></v-btn>
            <!--<v-btn
            absolute
            :color="config.mcolor"
            :style="`color:${config.mfontcolor} !important`"
            fab
            x-large
            right
            top
            >{{ product.price }}</v-btn
          >          
          <h3 class="display-1 font-weight mb-2">{{ product.name }}</h3>-->
            <div
              class="font-weight-light subtitle-1 mb-2 text-justify"
              v-text="product.description"
            ></div>
          </v-card-text>
          <!--<v-card-actions class="justify-center">
          <v-btn
            block
            @click="buyreward"
            :color="config.mcolor"
            :style="`color:${config.mfontcolor} !important`"
            v-text="$t('AppScreen.BUY')"
          ></v-btn>
        </v-card-actions>-->
        </v-card>
      </v-hover>
    </v-card>
  </div>
</template>
<script>
import { NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"

export default {
  data() {
    return {
      id: 0,
      type: "",
      product: {
        id: 0,
        name: "",
        description: "",
        picture: "",
        price: 0,
        is_virtual: false,
      },
      username: "",
      config: {},
    }
  },
  created() {
    this.id = this.$route.params.id
    this.type = this.$route.params.type
    this.setupLayout()
    this.loadReward()
  },
  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "pcolor", data.primary_color)
        this.$set(this.config, "pfontcolor", data.primary_font_color)
      }
    },
    /**
     * Load the reward info
     */
    loadReward() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getReward(token, passedCompanyId, lang, this.id)
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
      api.getUserAddress(token, passedCompanyId).then((result) => {
        let response = result.data
        if (response.data) {
          let data = response.data
          this.username = data.full_name
        }
      })
    },
    /**
     * Navigate to previous url
     */
    navigate() {
      this.$router.go(-1)
    },
    /**
     * Redirect to buy screen.
     */
    buyreward() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "buyreward",
        params: { id: this.id },
        query: { company_name: passedCompanyId },
      })
    },
  },
}
</script>
<style>
.v-card--reveal {
  align-items: flex-start;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
.borderbtm1px {
  border-bottom: 1px solid #d8d7d7;
}
</style>
