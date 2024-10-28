<template>
  <span>
    <v-card flat class="mb-2">
      <v-col class="col-8">
        <div
          class="title 2take"
          id="rewardTitle"
          :style="`color:${config.mfontcolor}`"
        >
          {{ $t("AppScreen.REWARD_TITLE") }}
        </div>
      </v-col>

      <!-- <vue-content-loading :width="200" :height="180" v-bind:class="{ hidden: (loaded) }" style="max-height: 300px">
        <rect x="4" y="5" rx="4" ry="4" width="100" height="170" />
        <rect x="108" y="5" rx="4" ry="4" width="100" height="170" />
      </vue-content-loading> -->

      <v-row v-if="!showRewards && loaded" id="rewardsPlaceholder">
        <v-col cols="12">
          <div id="rewardsPlaceholeder">
            <img
              src="../../assets/images/rewards/placeholder.png"
              id="reward-placeholder-img"
            />
            <p id="reward-placeholder-txt">
              {{ $t("AppScreen.NO_REWARDS_PLACEHOLDER") }}
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row
        v-bind:class="{
          hiddenelement: !showRewards,
          visibleelement: showRewards,
        }"
      >
        <v-col
          class="col-4 text-right"
          id="rewards-scroll-btns"
          v-if="config.rewardLayout != 'Cocacola2'"
        >
          <v-btn-toggle>
            <v-btn icon class="border0px" @click="triggerprev">
              <v-icon>mdi-chevron-left-box</v-icon>
            </v-btn>
            <v-btn icon class="border0px" @click="triggernext">
              <v-icon>mdi-chevron-right-box</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-slide-group
        v-model="model"
        multiple
        center-active
        :show-arrows="false"
        class="v-rewards"
        ref="myslide"
        v-if="config.rewardLayout != 'Cocacola2'"
      >
        <v-slide-item v-for="n in rewards" :key="n.id" class="ma-1 ml-2 mb-3">
          <v-card
            flat
            :style="`margin-right:${config.marginright} !important;`"
          >
            <v-card
              elevated
              max-width="280"
              @click="rewardRedirect(n.is_virtual, n.id)"
              v-if="config.rewardLayout == 'Default'"
            >
              <v-img
                :src="n.picture"
                v-if="n.picture"
                height="150px"
                contain
              ></v-img>
              <v-card-title
                v-text="n.name"
                class="font-weight-bold"
              ></v-card-title>
              <v-card-text>
                <div class="title" v-text="getPoints(n.price)"></div>
              </v-card-text>
            </v-card>
            <v-card
              class="card-reward"
              elevated
              width="170"
              min-height="380"
              :style="`box-shadow: ${config.shadowhOffset} ${config.shadowvOffset} ${config.shadowOpacity} ${config.shadowSize} ${config.shadowcolor};border-radius:20px;`"
              v-if="config.rewardLayout == 'PandG'"
            >
              <v-row
                dense
                class="arrow-down"
                :style="`color: ${config.mfontcolor}`"
              >
                <v-col cols="12">
                  <div
                    class="subtitle-2"
                    v-text="n.price"
                    :style="`color: ${config.mcolor};text-align:center`"
                  ></div>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <v-img
                    :src="n.picture"
                    contain
                    v-if="n.picture"
                    class="align-end reward-item"
                    min-height="200"
                    width="180"
                    :style="`border: 1px solid ${config.mfontcolor};border-radius:30px;margin-left:10px;`"
                  >
                  </v-img>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <div
                    class="d-flex flex-no-wrap caption pa-2 text-center reward-name"
                    :style="`color: ${config.mfontcolor};`"
                  >
                    <p>{{ n.name }}</p>
                  </div>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              @click="rewardRedirect(n.is_virtual, n.id)"
              v-if="config.rewardLayout == 'Cocacola'"
              style="border-radius: 20px"
            >
              <v-img
                :src="n.picture"
                v-if="n.picture"
                class="align-end"
                min-height="250"
                max-width="200"
              >
                <div>
                  <v-btn
                    block
                    rounded
                    :color="config.mcolor"
                    :style="`color: ${config.mcolor}`"
                  >
                    <div
                      v-text="n.name"
                      class="text-left text-truncate"
                      style="max-width: 125px"
                    ></div>
                    <v-spacer></v-spacer>
                    <div v-text="n.price" class="text-right"></div>
                  </v-btn>
                </div>
              </v-img>
            </v-card>
          </v-card>
        </v-slide-item>
      </v-slide-group>

      <v-row v-if="config.rewardLayout == 'Cocacola2'">
        <v-col v-for="n in rewards" cols="12" md="4" :key="n.id">
          <v-card
            ripple
            outlined
            class="cardshaped col-xs-12"
            @click="rewardRedirect(n.is_virtual, n.id)"
          >
            <v-img
              :src="n.picture"
              v-if="n.picture"
              height="250"
              contain
              :gradient="`to bottom left, ${convertHex(
                config.mcolor
              )} , ${convertHex(config.mfontcolor)}`"
            >
              <div class="d-flex fill-height flex-column">
                <v-card-title class="align-start body1">
                  <div
                    :style="`color:${config.mcolor} !important;`"
                    v-text="n.name"
                  ></div>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-card-title>
                  <v-btn
                    rounded
                    :style="`color:${config.mcolor} !important;`"
                    :color="config.mfontcolor"
                    v-text="n.price"
                  ></v-btn>
                </v-card-title>
              </div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-divider id="products-divider"></v-divider>
    </v-card>
  </span>
</template>

<script>
import { NO_COMPANY_FOUND } from "@/appConstants"
import api from "@/services/fetchapi"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
// import VueContentLoading from "vue-content-loading";
export default {
  // components: {
  //   VueContentLoading
  // },
  data() {
    return {
      model: [],
      rewards: [],
      index: 0,
      showRewards: false,
      config: {},
      loaded: false,
    }
  },
  created() {
    this.loadRewards()
    this.setupLayout()
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
        }
      }
    },
    getcolor() {
      let x = this.colors[Math.floor(Math.random() * this.colors.length)]
      return x
    },
    /**
     * Go to previous url
     */
    back() {
      this.$router.go("-1")
    },
    /**
     * Generate the Label shown
     */
    getPoints(val) {
      return (
        this.$t("AppScreen.PRICE") +
        ": " +
        val +
        " " +
        this.$t("AppScreen.POINTS")
      )
    },
    getPointsLabel(val) {
      return val + " " + this.$t("AppScreen.POINTS")
    },
    /**
     * Action for Next button for scrolling the cards
     */
    triggernext() {
      this.$refs.myslide.scrollTo("next")
    },
    /**
     * Action for Previous button for scrolling the cards
     */
    triggerprev() {
      this.$refs.myslide.scrollTo("prev")
    },
    /**
     * Action for Previous button for scrolling the cards
     */
    convertHex: function (color) {
      color = color.replace("#", "")
      let r = parseInt(color.substring(0, 2), 16)
      let g = parseInt(color.substring(2, 4), 16)
      let b = parseInt(color.substring(4, 6), 16)
      let result = "rgba(" + r + "," + g + "," + b + "," + 0.5 + ")"
      return result
    },
    /**
     * Redirect to reward details
     * @param {string} rewardType - Reward Type
     * @param {string} rID - Reward ID
     * TARASCHANGE
     */
    //rewardRedirect(rewardType, rId) {
    //  console.log(rewardType);
    //  console.log(rId);
    //  return;
    //},
    rewardRedirect(rewardType, rId) {
      //   return;
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "rewardinfo",
        params: { type: rewardType, id: rId },
        query: { company_name: passedCompanyId },
      })
    },
    /**
     * Fetch and load the rewards as cards
     */
    loadRewards() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getProducts(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          if (Object.keys(response.data).length != 0) {
            let data = response.data
            this.rewards = data.reverse() //TODO: TARAS HARDCODE
            this.showRewards = true
          } else {
            this.showRewards = false
          }
          this.loaded = true
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
          this.showRewards = false
        })
    },
  },
}
</script>
<style>
.v-rewards .v-slide-group__wrapper {
  overflow-x: scroll;
}
.v-rewards ::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.v-rewards ::-webkit-scrollbar-corner {
  background: transparent;
}
.v-rewards ::-webkit-scrollbar-thumb {
  background: rgba(179, 181, 182, 0.5);
  border-radius: 8px;
}

.arrow-down {
  width: 4.3em;
  height: 3.2em;
  display: inline-block;
  position: relative;
  background: currentColor;
  border-radius: 3px;
  vertical-align: top;
  border-top-left-radius: 7px !important;
  border-top-right-radius: 7px !important;
  left: 120px;
}
.arrow-down:after {
  border-right: 2.2em solid transparent;
  border-left: 2.2em solid transparent;
  border-top: 2.3em solid currentColor;
  position: absolute;
  content: "";
  bottom: -2.2em;
  left: -0.06em;
  border-radius: 5px;
}
.cardshaped {
  border-radius: 40px !important;
}
</style>
