<template>
  <div class="monster-wrapper">
    <div
      class="title 2take monster-title"
      id="rewardTitle"
      :style="`color:${config.mfontcolor}`"
    >
      {{ $t("AppScreen.REWARD_TITLE") }}
    </div>

    <div class="monster-block-1">
      <img class="logo-105" src="~@/assets/images/105-3.png" />
      <img class="monster-can" src="~@/assets/images/monster-can.png" />
      <ol>
        <li>KUP PIZZĘ Z MONSTER</li>
        <li>ZARAJESTRUJ PARAGON</li>
        <li>GRAJ O WARTOŚCIOWE</li>
      </ol>
      <h1>NAGRODY!</h1>
    </div>

    <div class="monster-block-2">
      <div class="top-line">
        <span class="no-receipt">!</span>
        <h5 v-if="notifications == 0">BRAK ZAREJESTROWANEGO PARAGONU</h5>
        <h5 v-if="notifications > 0" style="text-transform: uppercase">
          Zagraj w grę
        </h5>
      </div>
      <div class="rewards">
        <img src="~@/assets/images/rewards.png" />
      </div>
      <a
        v-if="notifications == 0"
        class="btn"
        @click="goToReceiptGamification()"
        >ODBIERZ</a
      >
      <a
        v-if="notifications > 0"
        class="btn"
        @click="goGame()"
        style="text-transform: uppercase"
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
.monster-wrapper {
  padding: 50px 20px;
}

.monster-block-1,
.monster-block-2 {
  margin-top: 50px;
  padding: 30px 10px;
  padding-top: 50px;
  color: #fff;
  border-radius: 30px;
  background: -moz-linear-gradient(
    top,
    rgba(186, 214, 62, 0.85) 0%,
    rgba(125, 195, 68, 0.85) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    top,
    rgba(186, 214, 62, 0.85) 0%,
    rgba(125, 195, 68, 0.85) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    to bottom,
    rgba(186, 214, 62, 0.85) 0%,
    rgba(125, 195, 68, 0.85) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2bad63e', endColorstr='#f27dc344',GradientType=0 ); /* IE6-9 */
  position: relative;
}

.monster-block-1 {
  font-family: "Fact Compressed" !important;
  font-size: 22px !important;
}

.monster-block-2 {
  font-family: "Fact Compressed" !important;
  font-size: 22px !important;
}

.monster-block-1 h1 {
  text-align: left;
  margin-left: 60px;
  margin-top: 20px;
  font-size: 32px;
}

.monster-block-1 .logo-105 {
  position: absolute;
  top: 4px;
  right: 3px;
  width: 120px;
}

.monster-block-1 .monster-can {
  height: 206px;
  position: absolute;
  top: 30px;
  right: 10px;
}

.monster-block-2 {
  padding: 10px 10px;
  padding-bottom: 20px;
}

.monster-block-2 .no-receipt {
  display: inline-block;
  background: #000;
  color: #fff;
  border-radius: 999px;
  text-align: center;
  width: 30px;
  height: 30px;
  line-height: 30px;
}

.monster-block-2 .top-line h5,
.monster-block-2 .top-line .no-receipt {
  float: left;
}

.monster-block-2 .top-line {
  line-height: 30px;
}

.monster-block-2 h5 {
  padding-left: 10px;
  font-weight: 300;
  font-size: 22px;
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
</style>
