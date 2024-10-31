<template>
  <div class="root">
    <v-container
      :style="`background-color:${
        results.length > 0 ? config.pcolor + '4d' : config.pcolor
      };`"
      class="top_container"
    >
      <div class="icon_container flex">
        <v-avatar
          variant="elevated"
          :size="avatarSize"
          style="background-color: white"
        >
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
            <v-tabs fixed-tabs v-model="tab">
              <v-tab
                :style="`background-color:${
                  results.length > 0 ? config.pcolor + '4d' : config.pcolor
                }; padding-top:10px; padding-bottom:10px;`"
                class="tabs"
                value="1"
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
                value="2"
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
                value="3"
                ><div style="display: flex; flex-direction: column; gap: 5px">
                  <v-icon size="15px" color="white">mdi-history</v-icon>
                  <span class="tab_title">{{ $t("AppScreen.HISTORY") }}</span>
                </div>
              </v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="1">
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
                    <p :style="`color:${config.mfontcolor};font-size: 24px`">
                      {{ gamification?.points }}
                    </p>
                    <p :style="`color:${config.mfontcolor};font-size: 24px`">
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
              </v-tabs-window-item>
              <v-tabs-window-item value="2">
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
              </v-tabs-window-item>
              <v-tabs-window-item value="3">
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
                  <v-icon :color="config.mfontcolor">mdi-help-circle</v-icon>
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
                    <span>
                      {{ `${$t("AppScreen.YOU_RECEIVED")} ` }}
                    </span>
                    <span style="font-weight: bold">
                      {{ langPoints(10, "point") }}
                    </span>
                  </div>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
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
        v-if="type !== GamificationType?.BILL"
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
import { lang_points } from "@/helpers/lang_points"
import companyconfig from "@/core/companyconfig"
import Receipt from "@/views/home/tasks/receiptTask.vue"
import { useI18n } from "vue-i18n"
import InviteContent from "./inviteTaskContent.vue"
import { ref, computed, onMounted } from "vue"

export default {
  components: {
    Receipt,
    InviteContent,
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
  setup(props) {
    const { t } = useI18n()
    const isDescriptionShown = ref(false)
    const tab = ref("1")
    const surveyName = ref("")
    const results = ref([])
    const type = ref(props.gamification.type)
    const config = ref({})
    const inviteCode = ref("")

    const getTitle = computed(() => {
      const type = props.gamification.type
      switch (type) {
        case GamificationType.SURV:
        case GamificationType.ASURV:
          return `${t("AppScreen.SURVEY_TYPE")} ${surveyName.value}`
        case GamificationType?.BILL:
          return `${t("AppScreen.BILL_TYPE")}`
        case GamificationType.REG:
          return `${t("AppScreen.REG_TYPE")}`
        default:
          return `${props.gamification.title}`
      }
    })

    const getButtonTitle = computed(() => {
      return GamificationButtonTitles[type.value]
    })

    const getInfo = computed(() => {
      return GamificationInfo[type.value]
    })

    const getRules = computed(() => {
      return GamificationRules[type.value]
    })

    const gamType = computed(() => {
      const iconName = GamificationIcons[type.value]
      return iconName
    })

    const buttonTitle = computed(() => {
      return `+ ${props.gamification?.points} ${t("AppScreen.POINTS_SHORT")}`
    })

    const avatarSize = computed(() => {
      return isDescriptionShown.value ? 70 : 50
    })

    const iconSize = computed(() => {
      return isDescriptionShown.value ? 40 : 30
    })

    const isButtonDisabled = computed(() => {
      const type = props.gamification.type
      return (
        results.value.length > 0 &&
        (type === GamificationType.SURV || type === GamificationType.ASURV)
      )
    })

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.value.mcolor = data.main_color
        config.value.mfontcolor = data.main_font_color
        config.value.rewardLayout = data.rewardLayout
        config.value.pcolor = data.primary_color
      }
    }

    const toAction = () => {
      switch (type.value) {
        case GamificationType.SURV:
          toSurvey()
          break
        case GamificationType.ASURV:
          toSurvey()
          break
        case GamificationType.REG:
          inviteFiend()
          break
        default:
          console.error("Unknown gamification type")
      }
    }

    const toSurvey = () => {
      this.$router.push({
        name: "surveys",
        query: { company_name: props.company },
      })
    }

    const inviteFiend = () => {
      console.info("inviteFiend")
    }

    const langPoints = (num) => {
      const result = lang_points(num, t("AppScreen.POINT"))
      return `${num} ${result}`
    }

    const loadSurvey = () => {
      if (
        props.gamification.type === GamificationType.SURV &&
        props.gamification.type === GamificationType.ASURV
      ) {
        api
          .getSurvey(props.gamification.survey_id)
          .then((result) => {
            let response = result.data
            surveyName.value = response.name
          })
          .catch((err) => {
            let errormsg = err.data.message
            if (errormsg === "NO_SURVEY_FOUND") {
              console.error(errormsg)
            }
            surveyName.value = ""
          })
      } else {
        surveyName.value = ""
      }
    }

    const loadResults = async () => {
      const userId = localStorage.getItem("system_user_id")
      api
        .getSurveyResult(props.gamification.survey_id, userId)
        .then((result) => {
          results.value = result.data ?? []
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === "NO_SURVEY_FOUND") {
            console.error(errormsg)
          }
        })
    }

    const getInviteCode = () => {
      if (props.gamification.type !== GamificationType.REG) {
        return
      }
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getInviteCode(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response) {
            inviteCode.value = response.inviteCode
            // showInvite.value = true;
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          // showInvite.value = false;
          if (errmsg === "NO_INVITE_CODE") {
            console.error(err)
          }
        })
    }

    const toggleDescription = () => {
      isDescriptionShown.value = !isDescriptionShown.value
    }

    const beforeEnter = (el) => {
      el.style.maxHeight = "0"
    }

    const enter = (el, done) => {
      el.style.maxHeight = el.scrollHeight * 15 + "px"
      el.style.opacity = "0"
      setTimeout(() => {
        el.style.opacity = "1"
        done()
      }, 300)
    }

    const leave = (el, done) => {
      el.style.maxHeight = "0"
      el.style.opacity = "1"
      setTimeout(() => {
        el.style.opacity = "0"
        done()
      }, 300)
    }

    onMounted(() => {
      loadSurvey()
      loadResults()
      setupLayout()
      getInviteCode()
    })

    return {
      GamificationType,
      isDescriptionShown,
      tab,
      surveyName,
      results,
      type,
      config,
      inviteCode,
      getTitle,
      getButtonTitle,
      getInfo,
      getRules,
      gamType,
      buttonTitle,
      avatarSize,
      iconSize,
      isButtonDisabled,
      setupLayout,
      toAction,
      toSurvey,
      inviteFiend,
      langPoints,
      loadSurvey,
      loadResults,
      getInviteCode,
      toggleDescription,
      beforeEnter,
      enter,
      leave,
    }
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
  overflow: hidden;
  opacity: 1;
  margin-top: 35px;
}

.top_container {
  height: 60px;
}
.tabs {
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
