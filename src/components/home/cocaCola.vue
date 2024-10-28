<template>
  <div class="monster-wrapper">
    <div class="monster-block-1"></div>

    <div class="monster-block-2">
      <div class="top-line">
        <span class="no-receipt">!</span>
        <h5 v-if="notifications == 0">BRAK ZAREJESTROWANEGO PARAGONU</h5>
        <h5 v-if="notifications > 0" style="text-transform: uppercase">
          Zagraj w grę
        </h5>
      </div>
      <div class="rewards">
        <img src="~@/assets/images/cola_rewards.png" />
      </div>
      <a
        v-if="notifications == 0"
        id="scan-btn-cola"
        @click="goToReceiptGamification()"
      >
        <div id="scan-btn-cola-inner" style="font-weight: 900">
          <span class="scan-btn-line-1" style="font-size: 30px">SKANUJ</span
          ><br /><span class="scna-btn-line-2" style="font-size: 24px"
            >PARAGON</span
          >
        </div>
      </a>
      <a
        v-if="notifications > 0"
        id="scan-btn-cola"
        class="btn"
        @click="goGame()"
        style="text-transform: uppercase; text-align: center"
        >Zagraj</a
      >
    </div>
  </div>
</template>

<script>
import { NO_COMPANY_FOUND, NO_COMPANY_TASK_FOUND } from "@/appConstants"
import api from "@/services/fetchapi"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import config from "@/variable"
//import VueContentLoading from "vue-content-loading";
export default {
  components: {
    //VueContentLoading
  },
  data() {
    return {
      model: [],
      rewards: [],
      index: 0,
      notifications: 0,
      showRewards: false,
      config: {},
      loaded: false,
      tasks: {},
    }
  },
  created() {
    this.loadRewards()
    this.setupLayout()
    this.loadtasks()
    this.getNotifications()
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
    goToReceiptGamification() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      for (let i = 0; i < this.tasks?.length; i++) {
        if (this.tasks[i].type === "BILL") {
          this.$router.push({
            name: "receipt",
            params: { id: this.tasks[i].id },
            query: { company_name: passedCompanyId },
          })
        }
      }
    },
    /**
     * Load the scoreboard
     * @param {decimal} productprice - Less Expensive product price
     */
    getNotifications() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getNotifications(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response) {
            this.notifications = response.notifications.length
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    goGame() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      window.location.href =
        config.baseUrl +
        "/game/index?company_name=" +
        passedCompanyId +
        "&access_token=" +
        token
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
    loadtasks() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = this.$i18n.locale
      api
        .getTasks(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          this.tasks = response.data
          this.showTasks = true
        })
        .catch((err) => {
          this.showTasks = false
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.log(errormsg)
          }
        })
    },
  },
}
</script>
<style>
@font-face {
  font-family: Gotham;
  src: url("~@/assets/fonts/Gotham/Gotham-Bold.otf") format("opentype");
}

/*@font-face {font-family: "Gotham Medium"; src: url("//db.onlinewebfonts.com/t/9a2bc11be56851dde98c1b49302cc21a.eot"); src: url("//db.onlinewebfonts.com/t/9a2bc11be56851dde98c1b49302cc21a.eot?#iefix") format("embedded-opentype"), url("//db.onlinewebfonts.com/t/9a2bc11be56851dde98c1b49302cc21a.woff2") format("woff2"), url("//db.onlinewebfonts.com/t/9a2bc11be56851dde98c1b49302cc21a.woff") format("woff"), url("//db.onlinewebfonts.com/t/9a2bc11be56851dde98c1b49302cc21a.ttf") format("truetype"), url("//db.onlinewebfonts.com/t/9a2bc11be56851dde98c1b49302cc21a.svg#Gotham Medium") format("svg"); }*/
/*@font-face {font-family: "TCCC-UnityCondensed"; src: url("//db.onlinewebfonts.com/t/d3346109f294e9afb85ec699713859ad.eot"); src: url("//db.onlinewebfonts.com/t/d3346109f294e9afb85ec699713859ad.eot?#iefix") format("embedded-opentype"), url("//db.onlinewebfonts.com/t/d3346109f294e9afb85ec699713859ad.woff2") format("woff2"), url("//db.onlinewebfonts.com/t/d3346109f294e9afb85ec699713859ad.woff") format("woff"), url("//db.onlinewebfonts.com/t/d3346109f294e9afb85ec699713859ad.ttf") format("truetype"), url("//db.onlinewebfonts.com/t/d3346109f294e9afb85ec699713859ad.svg#TCCC-UnityCondensed") format("svg"); }*/

header .v-image__image {
  display: none;
}

#close-widget-btn i {
  color: #000 !important;
}

main.home {
  background: url(~@/assets/images/cola_index_bg.jpg) no-repeat top center;
  background-size: cover;
}

.monster-wrapper {
  padding: 0;
}

.monster-block-1 {
  background: url(~@/assets/images/cola_block_1.png) no-repeat top center;
  width: 260px;
  height: 410px;
  margin: 0 auto;
  background-size: 100%;
}

.monster-block-2 {
  padding: 10px 10px;
  padding-bottom: 20px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  width: 350px;
}

.monster-block-2 .no-receipt {
  display: inline-block;
  background: #000;
  color: #fff;
  clip-path: polygon(44% 12%, 99% 28%, 88% 88%, 32% 95%, 14% 49%);
  border-radius: 0 !important;
  text-align: center;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 21px;
  padding-left: 3px;
}

.monster-block-2 .top-line h5,
.monster-block-2 .top-line .no-receipt {
  float: left;
}

.monster-block-2 .top-line {
  line-height: 16px;
}

.monster-block-2 h5 {
  padding-left: 10px;
  font-size: 12px;
  font-family: "Gotham Bold", sans-serif !important;
  line-height: 34px;
  margin-bottom: 20px;
}

.monster-block-2 .rewards img {
  max-width: 100%;
}

.monster-block-2 .btn {
  color: #fff;
  background: #000;
  padding: 5px 20px;
  border-radius: 50px;
  font-weight: 300;
  font-size: 20px;
}

#scan-btn-cola {
  clip-path: polygon(23% 0, 90% 0, 100% 58%, 84% 100%, 15% 100%, 0 71%, 4% 10%);
  overflow: hidden;
  display: block;
  margin-top: 20px;
}

#scan-btn-cola-inner {
  width: 100%;
  clip-path: polygon(23% 0, 90% 0, 100% 58%, 84% 100%, 15% 100%, 0 71%, 4% 10%);
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#353535+0,000000+100 */
  background: rgb(53, 53, 53); /* Old browsers */
  background: -moz-linear-gradient(
    top,
    rgba(53, 53, 53, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(53, 53, 53, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(53, 53, 53, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#353535', endColorstr='#000000',GradientType=0 ); /* IE6-9 */

  display: block;
  width: 220px;
  height: 80px;
  text-align: center;
  line-height: 25px;
  padding-top: 11px;
  margin: 0 auto;
}
</style>
