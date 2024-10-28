<template>
  <div class="root">
    <v-container
      :style="`background-color:${
        results.length > 0 ? config.pcolor + '4d' : config.pcolor
      };`"
      class="top_container"
    >
      <div class="icon_container flex">
        <v-avatar :size="avatarSize">
          <v-icon class="white" :color="config.mfontcolor" :size="iconSize">{{
            gamType
          }}</v-icon>
        </v-avatar>
      </div>
    </v-container>

    <v-container class="container-content">
      <div class="title">
        <h3
          :style="`color:${config.mfontcolor};text-align: center; margin-bottom: 10px`"
        >
          {{ getTitle }}
        </h3>
      </div>
      <transition
        name="fade"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <template v-if="isDescriptionShown">
          <v-card>
            <v-tabs fixed-tabs>
              <v-tab
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                }; padding-top:10px; padding-bottom:10px;`"
                class="tabs"
                :key="1"
              >
                <div style="display: flex; flex-direction: column; gap: 5px">
                  <v-icon size="15px" color="white">mdi-trophy</v-icon>
                  <span class="tab_title">{{ $t("AppScreen.WHAT_GAIN") }}</span>
                </div>
              </v-tab>
              <v-tab
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                };`"
                class="tabs"
                :key="2"
              >
                <div style="display: flex; flex-direction: column; gap: 5px">
                  <v-icon size="15px" color="white">mdi-check-bold</v-icon>
                  <span class="tab_title">{{ $t("AppScreen.RULES") }}</span>
                </div>
              </v-tab>
              <v-tab
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                };`"
                class="tabs"
                :key="3"
                ><div style="display: flex; flex-direction: column; gap: 5px">
                  <v-icon size="15px" color="white">mdi-history</v-icon>
                  <span class="tab_title">{{ $t("AppScreen.HISTORY") }}</span>
                </div>
              </v-tab>
              <v-tab-item v-for="n in 3" :key="n">
                <v-card flat>
                  <v-card-text v-if="n === 1">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        justify-content: space-around;
                      "
                    >
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                        "
                      >
                        <p
                          :style="`color:${config.mfontcolor};font-size: 24px`"
                        >
                          {{ gamification?.points }}
                        </p>
                        <p
                          :style="`color:${config.mfontcolor};font-size: 24px`"
                        >
                          {{ $t("AppScreen.BUY_POINTS") }}
                        </p>
                      </div>
                      <p
                        :style="`color:${config.mfontcolor};width: 50%; text-align: center`"
                      >
                        {{ $t("AppScreen.YOU_RECEIVE_REWARD") }}
                        {{ gamification?.points }}
                        {{ $t("AppScreen.POINTS_FOR") }}
                        {{ getInfo }}
                      </p>
                    </div>
                  </v-card-text>
                  <v-card-text v-card-text v-if="n === 2">
                    <div
                      :style="`color:${config.mfontcolor};display: flex;flex-direction: column;align-items: center;gap: 10px;justify-content: space-around;`"
                      v-if="type !== GamificationType.REG"
                    >
                      <p>{{ $t("AppScreen.RULES") }}:</p>
                      <p style="text-align: center">
                        {{ getRules }} {{ $t("AppScreen.WILL_GET") }}
                        {{ gamification?.points }}
                        {{ $t("AppScreen.BUY_POINTS") }} .
                      </p>
                    </div>
                    <div
                      :style="`color:${config.mfontcolor};display: flex;flex-direction: column;align-items: center;gap: 10px;justify-content: space-around;`"
                      v-else
                    >
                      <InviteContent
                        :titleObject="{ title: 'Your Title Here' }"
                        :gamification="gamification"
                        :company="company"
                        :inviteCode="inviteCode"
                      />
                    </div>
                  </v-card-text>
                  <v-card-text v-card-text v-if="n === 3">
                    <div
                      v-if="results.length === 0"
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        justify-content: space-around;
                      "
                    >
                      <v-icon :color="config.mfontcolor"
                        >mdi-help-circle</v-icon
                      >
                      <p :style="`color:${config.mfontcolor}`">
                        {{ $t("AppScreen.GOT_NO_POINTS") }}
                      </p>
                    </div>

                    <div
                      v-else
                      :style="`color:${config.mfontcolor};display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        justify-content: space-around;`"
                    >
                      <v-icon :color="config.mfontcolor"
                        >mdi-checkbox-marked-outline</v-icon
                      >
                      <p>{{ $t("AppScreen.HISTORY_TITLE") }}</p>
                      <div>
                        <span style="">
                          {{ $t("AppScreen.YOU_RECEIVED") }}
                        </span>
                        <span style="font-weight: bold">
                          {{ langPoints(10, "point") }}
                        </span>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </template>
      </transition>
    </v-container>

    <v-container
      :style="`background-color:${
        results.length > 0 ? config.pcolor + '4d' : config.pcolor
      };`"
      class="button_container"
    >
      <button
        :style="`background-color:transparent;`"
        class="white--text text-h6 btn"
        @click="toggleDescription()"
        :ripple="false"
      >
        <v-icon class="icon" size="30px">{{
          isDescriptionShown
            ? "mdi-chevron-double-up"
            : "mdi-chevron-double-down"
        }}</v-icon>
        <span class="button_title" style="text-wrap: nowrap">{{
          isDescriptionShown ? $t("AppScreen.HIDE") : $t("AppScreen.SEE_MORE")
        }}</span>
      </button>

      <v-divider
        class="border-opacity-100 separator"
        color="white"
        vertical
      ></v-divider>

      <button
        v-if="type !== GamificationType.BILL"
        :style="`background-color:transparent`"
        class="white--text text-h6 btn"
        @click="toAction"
        :disabled="isButtonDisabled"
      >
        <v-icon class="icon">mdi-check-bold</v-icon>
        <span class="button_title">{{ getButtonTitle }}</span>
      </button>
      <Receipt
        v-else
        style="color: blue"
        :gamificationId="gamification.id"
        class="ml-2"
        :isButton="false"
      />

      <!-- <svg
        id="svg"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="80"
        height="80"
        viewBox="0, 0, 400,408.3916083916084"
      >
        <g id="svgg">
          <path
            fill="blue"
            id="path0"
            d="M188.315 32.012 C 185.511 35.772,170.026 61.425,153.904 89.019 L 124.591 139.189 90.967 145.418 C 23.075
                                   157.994,15.250 159.827,8.392 164.757 C -7.834 176.421,-5.045 182.567,36.635 226.975 C 54.477 245.985,72.195 264.948,76.009
                                   269.114 C 82.289 275.976,82.744 278.085,80.833 291.492 C 63.227 414.971,64.729 416.912,146.853 376.837 C 198.224 351.769,
                                   200.093 351.191,211.820 356.752 C 217.627 359.506,239.371 369.875,260.140 379.795 C 328.690 412.538,335.207 408.575,325.820
                                   339.860 C 317.063 275.759,316.976 277.266,330.304 262.937 C 402.045 185.811,400.713 187.462,399.483 177.166 C 397.743 162.598,392.200
                                   160.725,300.699 143.794 C 274.372 138.923,278.627 143.472,243.383 82.517 C 207.475 20.415,201.232 14.690,188.315 32.012 M233.429
                                   106.019 L 264.061 158.806 282.380 162.038 C 292.456 163.816,317.391 168.168,337.791 171.708 C 358.191 175.249,375.482 178.746,376.215
                                   179.478 C 377.479 180.742,369.091 190.325,317.941 246.050 L 296.021 269.930 297.768 283.916 C 298.729 291.608,301.811 316.154,304.617
                                   338.462 C 307.423 360.769,309.577 379.195,309.405 379.409 C 309.032 379.869,288.545 370.396,239.614 347.138 C 198.121 327.417,201.888
                                   328.107,183.496 336.855 C 119.369 367.355,96.802 377.622,93.892 377.622 C 90.667 377.622,94.600 336.880,102.830 285.025 L 105.318 269.351
                                   84.128 247.156 C 38.766 199.645,22.149 181.114,23.604 179.660 C 24.436 178.827,41.809 175.249,62.209 171.708 C 82.609 168.168,107.819
                                   163.771,118.231 161.938 L 137.161 158.605 157.125 124.757 C 196.124 58.635,199.498 53.147,201.139 53.189 C 202.051 53.212,216.582
                                   76.985,233.429 106.019 "
            stroke="none"
            fill-rule="evenodd"
          ></path>
        </g>
      </svg> -->
    </v-container>
  </div>
</template>

<script>
import {
  GamificationIcons,
  GamificationType,
  GamificationButtonTitles,
  GamificationInfo,
  GamificationRules,
} from "@/appConstants"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import Vue from "vue"
import { lang_points } from "@/helpers/lang_points"
import companyconfig from "@/core/companyconfig"
import Receipt from "@/views/home/tasks/receiptTask.vue"
import InviteContent from "./inviteTaskContent.vue"
export default {
  components: {
    Receipt,
    InviteContent,
  },
  data() {
    return {
      isDescriptionShown: false,
      tab: "one",
      surveyName: "",
      results: [],
      type: this.gamification.type,
      config: {},
      GamificationType,
      inviteCode: "",
    }
  },
  props: {
    titleObject: {
      type: Object,
      required: true,
    },
    gamification: {
      type: Object,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },

  created() {
    this.loadSurvey(),
      this.loadResults(),
      this.setupLayout(),
      this.getInviteCode()
  },
  computed: {
    getTitle() {
      const type = this.gamification.type
      switch (type) {
        case GamificationType.SURV:
        case GamificationType.ASURV:
          return `${this.$t("AppScreen.SURVEY_TYPE")} ${this.surveyName}`
        case GamificationType.BILL:
          return `${this.$t("AppScreen.BILL_TYPE")}`
        case GamificationType.REG:
          return `${this.$t("AppScreen.REG_TYPE")}`
        default:
          return `${this.gamification.title}`
      }
    },
    getButtonTitle() {
      return GamificationButtonTitles[this.type]
    },
    getInfo() {
      return GamificationInfo[this.type]
    },
    getRules() {
      return GamificationRules[this.type]
    },
    gamType() {
      const iconName = GamificationIcons[this.type]
      return iconName
    },
    GamificationIcons() {
      return GamificationIcons
    },
    buttonTitle() {
      return `+ ${this.gamification?.points} ${this.$t(
        "AppScreen.POINTS_SHORT"
      )}`
    },
    avatarSize() {
      return this.isDescriptionShown ? 70 : 50
    },
    iconSize() {
      return this.isDescriptionShown ? 40 : 30
    },
    isButtonDisabled() {
      const type = this.gamification.type
      return (
        this.results.length > 0 &&
        (type === GamificationType.SURV || type === GamificationType.ASURV)
      )
    },
  },
  methods: {
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "rewardLayout", data.rewardLayout)
        this.$set(this.config, "pcolor", data.primary_color)
      }
    },
    toAction() {
      console.log("🚀 ~ toAction ~ this.type:", this.type)
      switch (this.type) {
        case GamificationType.SURV:
          this.toSurvey()
          break
        case GamificationType.ASURV:
          this.toSurvey()
          break
        case GamificationType.REG:
          this.inviteFiend()
          break
        default:
          console.error("Unknown gamification type")
      }
    },
    toSurvey() {
      this.$router.push({
        name: "surveys",
        query: { company_name: this.company },
      })
    },
    inviteFiend() {
      console.log("inviteFiend")
    },
    langPoints(num) {
      const result = lang_points(num, this.$t("AppScreen.POINT"))
      return `${num} ${result}`
    },
    loadSurvey() {
      if (
        this.gamification.type === GamificationType.SURV &&
        this.gamification.type === GamificationType.ASURV
      ) {
        api
          .getSurvey(this.gamification.survey_id)
          .then((result) => {
            let response = result.data
            this.surveyName = response.name
          })
          .catch((err) => {
            let errormsg = err.data.message
            if (errormsg === "NO_SURVEY_FOUND") {
              console.error(errormsg)
            }
            this.surveyName = ""
          })
      } else {
        return (this.surveyName = "")
      }
    },
    async loadResults() {
      const userId = Vue.localStorage.get("system_user_id")
      api
        .getSurveyResult(this.gamification.survey_id, userId)
        .then((result) => {
          this.results = result.data ?? []
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === "NO_SURVEY_FOUND") {
            console.error(errormsg)
          }
        })
    },
    /** Load the invite code */
    getInviteCode() {
      if (this.gamification.type !== GamificationType.REG) {
        return
      }
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getInviteCode(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response) {
            this.inviteCode = response.inviteCode
            console.log(response.inviteCode)
            this.showInvite = true
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          this.showInvite = false
          if (errmsg === "NO_INVITE_CODE") {
            console.log(err)
          }
        })
    },
    toggleDescription() {
      this.isDescriptionShown = !this.isDescriptionShown
    },
    beforeEnter(el) {
      el.style.maxHeight = "0"
    },
    enter(el, done) {
      el.style.maxHeight = el.scrollHeight * 15 + "px"
      el.style.opacity = "0"
      setTimeout(() => {
        el.style.opacity = "1"
        done()
      }, 300)
    },
    leave(el, done) {
      el.style.maxHeight = "0"
      el.style.opacity = "1"
      setTimeout(() => {
        el.style.opacity = "0"
        done()
      }, 300)
    },
  },
}
</script>
<style>
.root {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon_container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  z-index: 1;
}

.button_container {
  display: flex;
  justify-content: space-between;
}

.btn {
  box-shadow: none;
  /* width: 45%; */
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}

.v-slide-group {
  flex-wrap: wrap;
}

.btn:disabled {
  cursor: not-allowed;
}

.button_title {
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 700;
  text-wrap: balance;
  /* max-width: 115px; */
}

.tab_title {
  white-space: nowrap;
  font-size: 10px;
  text-transform: capitalize;
}

.pkt_button_title {
  text-transform: lowercase;
  font-size: 18px;
  font-weight: 700;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  margin: 0 !important;
  padding: 0 !important;
}
.container-content {
  /* max-height: 700px; */
  overflow: hidden;
  opacity: 1;
  margin-top: 25px;
}

/* .container_color {
  background-color: #2a3947 !important;
} */

.top_container {
  height: 60px;
  /* background-color: #2a3947 !important; */
}
.tabs {
  /* background-color: #2a3947 !important; */
  color: white !important;
}
.v-tabs-slider {
  background-color: white !important;
}

.v-tabs-bar {
  height: 55px;
}

.icon {
  color: white !important;
}

.separator {
  border-color: white !important;
}

.title {
  height: 40px;
}
</style>
