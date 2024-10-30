<template>
  <div class="monster-wrapper">
    <div class="section-points">
      <v-container>
        <v-row>
          <v-col>
            <v-card
              class="ma-auto"
              :style="`color:${config.mfontcolor};height:100%;background: #ffffffb3`"
            >
              <p class="square-text" style="margin-top: 20px">
                {{ $t("AppScreen.YOU_HAVE") }}
                <span class="points">{{ totalPoints }}</span>
                {{ $t("AppScreen.BUY_POINTS") }}
              </p>
              <!-- <p class="square-text">{{ $t("AppScreen.POINTS_REACHED") }}</p> -->
              <v-btn
                :style="`background-color:${config.mcolor}`"
                class="ml-2"
                @click="goToGamification()"
              >
                {{ $t("AppScreen.GET_POINTS") }}
              </v-btn>
            </v-card>
          </v-col>
          <!-- <v-col cols="6">
            <v-card
              max-width="200"
              class="ma-auto"
              :style="`color:${config.mfontcolor};height:100%;background: #ffffffb3`"
            >
              <h2>{{ $t("AppScreen.SCAN_RECEIPT") }}</h2>
              <v-spacer></v-spacer>
              <Receipt
                v-if="receiptGamificationId"
                :gamificationId="receiptGamificationId"
                :company="null"
              />
            </v-card>
          </v-col> -->
        </v-row>
      </v-container>
    </div>

    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- GAME RECEIPT (Krystian asked to hide this module) -->
          <v-card
            :style="`color:${config.mfontcolor};width:100%`"
            class="mx-auto mb-5 pb-5 hidden"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div v-if="notifications == 0">
                <v-card-title
                  class="text"
                  style="font-size: 1rem"
                  v-text="'BRAK ZAREJESTROWANEGO PARAGONU'"
                ></v-card-title>

                <v-card-subtitle
                  v-text="'Skanuj paragon i zagraj w grę'"
                ></v-card-subtitle>

                <v-card-actions v-if="receiptGamificationId">
                  <Receipt
                    style="color: blue"
                    :gamificationId="receiptGamificationId"
                    class="ml-2"
                  />
                </v-card-actions>
              </div>
              <div v-else>
                <v-card-title
                  class="text pb-0"
                  style="font-size: 1rem"
                  v-text="`Zagraj w grę i wygraj ${win_points} punktów`"
                ></v-card-title>
                <v-card-title
                  v-if="notifications > 1"
                  class="text py-0"
                  style="font-size: 1rem"
                  v-text="'Masz jeszcze ' + notifications + ' prób(y)'"
                ></v-card-title>

                <v-card-actions :style="`color:${config.mcolor}`" class="pt-5">
                  <v-btn class="ml-2" @click="goGame()"> Zagraj </v-btn>
                  <v-btn
                    :style="`background-color:${config.mcolor}`"
                    class="ml-2"
                    @click="goScoreboard()"
                  >
                    Ranking
                  </v-btn>
                </v-card-actions>

                <v-card-text
                  class="py-2"
                  v-text="'Każdy paragon to szansa na wygraną'"
                ></v-card-text>
              </div>
            </div>
          </v-card>

          <!--  GAME AWARD -->

          <v-card
            :style="`color:${config.mfontcolor};width:100%;background: #ffffffb3`"
            class="mx-auto mb-5 pb-5"
            v-if="notifications > 0"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text pb-0 text-wrap"
                  style="font-size: 1rem"
                  v-text="
                    `${$t('AppScreen.PLAY_IN_GAME')} ${win_points} 
                    ${$t('AppScreen.BUY_POINTS')}`
                  "
                ></v-card-title>
                <v-card-title
                  v-if="notifications > 1"
                  class="text py-0 text-wrap"
                  style="font-size: 1rem"
                  v-text="
                    `${$t('AppScreen.STILL_HAVE')}  ${notifications} + ${$t(
                      'AppScreen.TRY'
                    )}`
                  "
                ></v-card-title>

                <v-card-actions :style="`color:white`" class="pt-5">
                  <v-btn
                    :style="`background-color:${config.mcolor}`"
                    class="ml-2"
                    @click="goGame()"
                  >
                    {{ $t("AppScreen.PLAY") }}
                  </v-btn>
                  <!-- <v-btn
                    :style="`background-color:${config.mcolor}`"
                    class="ml-2"
                    @click="goScoreboard()"
                  >
                    Ranking
                  </v-btn> -->
                </v-card-actions>

                <v-card-text
                  class="py-2 text-wrap"
                  v-text="$t('AppScreen.EVERY_PURCHASE')"
                ></v-card-text>
              </div>
            </div>
          </v-card>

          <!--    GAMIFICATION LIST-->

          <!-- <v-card
            :style="`color:${config.mfontcolor};width:100%;background: #ffffffb3`"
            class="mx-auto mb-5 pb-5"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="text"
                  style="font-size: 1rem"
                  v-text="$t('AppScreen.GET_POINTS')"
                ></v-card-title>

                <v-card-actions>
                  <v-btn
                    :style="`background-color:${config.mcolor}`"
                    class="ml-2"
                    @click="goToGamification()"
                  >
                    {{ $t("AppScreen.GET_POINTS") }}
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card> -->

          <!--    PRODUCTS LIST-->
          <v-card
            class="mx-auto mb-3 py-0"
            max-width="354"
            style="background: #fff0"
            variant="text"
          >
            <v-card-title
              class="text"
              style="font-size: 1rem; background: #ffffffcc"
              v-text="$t('AppScreen.REWARD_TITLE')"
            ></v-card-title>
            <v-card
              :key="'product' + product.id"
              class="mx-auto mb-3"
              :style="`color:${config.mfontcolor};width:100%;background:#ffffffcc`"
              v-for="product in rewards"
            >
              <v-img
                :src="product.picture"
                v-if="product.picture"
                max-height="350px"
                contain
              ></v-img>

              <v-card-title class="product_name">
                {{ product.name }}
              </v-card-title>

              <v-card-actions>
                <v-btn
                  :style="`background-color:${config.mcolor}`"
                  class="ma-2"
                  @click="buyReward(product)"
                >
                  {{ $t("AppScreen.BUY") }} {{ product.price }}
                  {{ $t("AppScreen.BUY_POINTS") }}
                </v-btn>

                <!--            <v-chip-->
                <!--                class="ma-2"-->
                <!--                v-if="product.price > 0"-->
                <!--            >-->
                <!--              {{ product.price }} punktów-->
                <!--            </v-chip>-->

                <v-spacer></v-spacer>

                <v-btn
                  :style="`color:${config.mfontcolor}`"
                  icon
                  @click="expandProductInfo(product)"
                >
                  <v-icon>{{
                    isExpandedProductInfo(product)
                      ? "mdi-chevron-up"
                      : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-alert
                v-if="productAlerts.includes(product.id)"
                type="warning"
                dismissible
              >
                {{ $t("Errors.NOT_ENOUGH_POINTS") }}
              </v-alert>

              <v-expand-transition>
                <div v-show="isExpandedProductInfo(product)">
                  <v-divider></v-divider>

                  <v-card-text
                    class="product-description"
                    v-html="product.description"
                  >
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { NO_COMPANY_FOUND, NO_COMPANY_TASK_FOUND } from "@/appConstants"
import api from "@/services/fetchapi"
import gameconfig from "@/services/gameconfigapi"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import Receipt from "@/views/home/tasks/receiptTask.vue"
import { i18n } from "@/plugins/i18n"
import { useI18n } from "vue-i18n"
export default {
  components: {
    Receipt,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    const model = ref([])
    const rewards = ref([])
    const index = ref(0)
    const notifications = ref(0)
    const showRewards = ref(false)
    const showNotification = ref(false)
    const config = reactive({})
    const loaded = ref(false)
    const tasks = ref({})
    const totalPoints = ref(0)
    const totalPointsUrl = config.apiEndrpoint + "/getpoints"
    const productsExpanded = ref([])
    const productAlerts = ref([])
    const receiptGamificationId = ref("")
    const gameId = ref("")
    const gameType = ref("")
    const win_points = ref(null)

    onMounted(() => {
      setAnalyticsDimension()
    })

    onBeforeMount(async () => {
      await loadRewards()
      setupLayout()
      loadTasks()
      getNotifications()
      getTotalPoints()
      loadGameConfig()
    })

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.mcolor = data.main_color
        config.mfontcolor = data.main_font_color
        config.pcolor = data.primary_color
        config.pfontcolor = data.primary_font_color
        config.rewardLayout = data.rewardLayout
        config.outercolor = data.layout_background_color_outer
        config.innercolor = data.layout_background_color_inner
        if (data.rewardLayout == "Cocacola") {
          config.marginright = "0px"
        } else if (data.rewardLayout == "PandD") {
          config.marginright = "16px"
          if (data.shadowDirection == "right") {
            config.shadowhOffset = data.shadowSize + "px"
            config.shadowvOffset = data.shadowSize + "px"
          } else if (data.shadowDirection == "left") {
            config.shadowhOffset = data.shadowSize * -1 + "px"
            config.shadowvOffset = data.shadowSize + "px"
          } else if (data.shadowDirection == "bottom") {
            config.shadowhOffset = data.shadowSize + "px"
            config.shadowvOffset = data.shadowSize + "px"
          } else if (data.shadowDirection == "top") {
            config.shadowhOffset = data.shadowSize + "px"
            config.shadowvOffset = data.shadowSize * -1 + "px"
          }
          config.shadowOpacity = data.shadowOpacity + "px"
          config.shadowcolor = data.shadowColor
          config.shadowSize = data.shadowSize + "px"
        }
      }
    }

    const goToReceiptGamification = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      for (let i = 0; i < tasks.value.length; i++) {
        if (tasks.value[i].type === "BILL") {
          router.push({
            name: "receipt",
            params: { id: tasks.value[i].id },
            query: { company_name: passedCompanyId },
          })
        }
      }
    }

    const getReceiptGamification = (data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === "BILL") {
          receiptGamificationId.value = data[i].id
        }
      }
    }

    const getNotifications = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getNotifications(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response) {
            notifications.value = response.notifications.length
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    const goGame = () => {
      let company = companyconfig.getCompanyScheme()
      const userId = localStorage.getItem("system_user_id")
      let token = auth.getAccessToken()

      switch (gameType.value) {
        case "MATCH":
          goMatchGame(company.active_game, company.id, userId, token)
          break
        case "WHEEL":
          goWheelGame(company.active_game, token)
          break
      }
    }

    const back = () => {
      router.go(-1)
    }

    const goMatchGame = (active_game, company_id, userId, token) => {
      window.location.href =
        "https://matchgame.web.app/?" +
        "game_id=" +
        active_game +
        "&company_id=" +
        company_id +
        "&user_id=" +
        userId +
        "&token=" +
        token
    }

    const goWheelGame = (active_game, token) => {
      window.location.href =
        "https://fortunegame.web.app/?" +
        "game_id=" +
        active_game +
        "&access_token=" +
        token
    }

    const getPoints = (val) => {
      return t("AppScreen.PRICE") + ": " + val + " " + t("AppScreen.POINTS")
    }

    const getPointsLabel = (val) => {
      return val + " " + t("AppScreen.POINTS")
    }

    const convertHex = (color) => {
      color = color.replace("#", "")
      let r = parseInt(color.substring(0, 2), 16)
      let g = parseInt(color.substring(2, 4), 16)
      let b = parseInt(color.substring(4, 6), 16)
      let result = "rgba(" + r + "," + g + "," + b + "," + 0.5 + ")"
      return result
    }

    const rewardRedirect = (rewardType, rId) => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "rewardinfo",
        params: { type: rewardType, id: rId },
        query: { company_name: passedCompanyId },
      })
    }

    const loadGameConfig = () => {
      let company = companyconfig.getCompanyScheme()
      gameconfig.getGameConfig(company.active_game).then((response) => {
        gameType.value = response.data.type
        win_points.value = response.data.win_points
      })
    }

    const loadRewards = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = i18n.global.locale

      api
        .getProducts(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          if (Object.keys(response.data).length != 0) {
            let data = response.data
            rewards.value = data.reverse()
            showRewards.value = true
          } else {
            showRewards.value = false
          }
          loaded.value = true
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.error(err)
          }
          showRewards.value = false
        })
    }

    const setAnalyticsDimension = () => {
      // let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      // gtag("config", "G-TB06WMS3NZ", {
      //   company_id: passedCompanyId,
      // })
    }

    const loadTasks = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = i18n.global.locale
      api
        .getTasks(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          tasks.value = response.data
          // showTasks.value = true
          getReceiptGamification(response.data)
        })
        .catch((err) => {
          // showTasks.value = false
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.error(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.error(errormsg)
          }
        })
    }

    const getTotalPoints = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()

      api
        .getPoints(token, passedCompanyId)
        .then((result) => {
          let json = result.data
          if (json.points.length > 0) {
            totalPoints.value = json.points[0].money.toFixed(2)
          } else {
            totalPoints.value = 0.0
          }
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.error(errormsg)
          } else if (errormsg === NO_COMPANY_TASK_FOUND) {
            console.error(errormsg)
          }
        })
    }

    const expandProductInfo = (product) => {
      if (productsExpanded.value.includes(product.id)) {
        productsExpanded.value.splice(
          productsExpanded.value.indexOf(product.id),
          1
        )
      } else {
        productsExpanded.value.push(product.id)
      }
    }

    const goScoreboard = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "scoreboard",
        })
      }

      router.push({
        name: "scoreboard",
        query: { company_name: passedCompanyId },
      })
    }

    const goToGamification = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "gamification",
        query: { company_name: passedCompanyId },
      })
    }

    const isExpandedProductInfo = (product) => {
      return productsExpanded.value.includes(product.id)
    }

    const buyReward = (product) => {
      if (parseFloat(totalPoints.value) < parseFloat(product.price)) {
        productAlerts.value.splice(productAlerts.value.indexOf(product.id), 1)
        productAlerts.value.push(product.id)
        if (typeof window.gtag !== "undefined") {
          window.gtag("event", "NEW_LOYALTY", {
            event_category: "purchase",
            value: "not_enough_points",
          })
        }
      } else {
        let passedCompanyId = companyconfig.getCompanyIdfromUrl()
        router.push({
          name: "buyreward",
          params: { id: product.id },
          query: { company_name: passedCompanyId },
        })
      }
    }

    return {
      model,
      rewards,
      index,
      notifications,
      showRewards,
      showNotification,
      config,
      loaded,
      tasks,
      totalPoints,
      totalPointsUrl,
      productsExpanded,
      productAlerts,
      receiptGamificationId,
      gameId,
      gameType,
      win_points,
      setupLayout,
      goToReceiptGamification,
      getReceiptGamification,
      getNotifications,
      goGame,
      back,
      goMatchGame,
      goWheelGame,
      getPoints,
      getPointsLabel,
      convertHex,
      rewardRedirect,
      loadGameConfig,
      loadRewards,
      setAnalyticsDimension,
      loadTasks,
      getTotalPoints,
      expandProductInfo,
      goScoreboard,
      goToGamification,
      isExpandedProductInfo,
      buyReward,
    }
  },
}
</script>
<style>
@font-face {
  font-family: Gotham;
  src: url("~@/assets/fonts/Gotham/Gotham-Bold.otf") format("opentype");
}

#close-widget-btn i {
  color: #000 !important;
}

main.home {
  /*background: url(~@/assets/images/cola_index_bg.jpg) no-repeat top center;*/
  background-size: cover;
}

.monster-wrapper {
  padding: 0;
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
  /*color: #fff;*/
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
  /*color:#fff;*/
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
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#353535', endColorstr='#000000', GradientType=0); /* IE6-9 */

  display: block;
  width: 220px;
  height: 80px;
  text-align: center;
  line-height: 25px;
  padding-top: 11px;
  margin: 0 auto;
}

footer {
  background-color: rgb(251, 52, 52);
}

.section-points .v-card {
  text-align: center;
  padding: 20px 10px;
}

.product-description p,
.square-text {
  margin-bottom: 0;
  font-size: 1rem;
}

.points {
  font-size: 32px;
  font-weight: 700;
}

.hidden {
  display: none;
}

.text-wrap {
  word-break: break-word;
}

.product_name {
  text-wrap: balance;
  word-break: break-word;
  text-align: center;
  justify-content: center;
}

.text {
  font-size: 1.3rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
}
</style>
