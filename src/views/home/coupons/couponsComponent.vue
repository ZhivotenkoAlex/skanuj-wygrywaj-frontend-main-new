<template>
  <v-container>
    <v-card class="mx-auto mb-3" max-width="344" style="width: 100%">
      <div class="root">
        <v-container
          :style="`background-color:${config.pcolor};`"
          class="top_container"
        >
          <div class="icon_container flex">
            <v-avatar
              variant="elevated"
              :size="avatarSize"
              style="background-color: white"
            >
              <v-icon class="white" :color="config.mfontcolor" :size="iconSize"
                >mdi-book-open-variant-outline</v-icon
              >
            </v-avatar>
          </div>
        </v-container>

        <v-container class="item-content">
          <div class="item-title">
            <h3
              :style="`color:${config.mfontcolor};text-align: center; margin-bottom: 10px`"
            >
              {{ $t("AppScreen.KNOWLEDGE") }}
            </h3>
          </div>
          <transition
            name="fade"
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
          >
            <div v-if="isDescriptionShown" class="coupon_list">
              <div v-for="(coupon, index) in coupons" :key="index">
                <couponItem :couponItem="coupon" />
              </div>
            </div>
          </transition>
        </v-container>

        <v-container
          :style="`background-color:${config.pcolor};`"
          class="button_container"
        >
          <button
            :style="`background-color:transparent;width: 50%;justify-content: center; margin-right: 10px;`"
            class="white--text text-h6 btn"
            @click="toggleDescription"
            :ripple="false"
          >
            <v-icon class="icon" size="30px">{{
              isDescriptionShown
                ? "mdi-chevron-double-up"
                : "mdi-chevron-double-down"
            }}</v-icon>
            <span class="button_title" style="text-wrap: nowrap">{{
              isDescriptionShown
                ? $t("AppScreen.HIDE")
                : $t("AppScreen.SEE_MORE")
            }}</span>
          </button>

          <v-divider
            class="border-opacity-100 separator"
            color="white"
            vertical
          ></v-divider>

          <div style="width: 50%"></div>
        </v-container>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted, reactive, computed } from "vue"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import couponItem from "./couponItem.vue"
import auth from "@/core/auth"

export default {
  components: {
    couponItem,
  },
  setup() {
    const gamifications = ref([])
    const showGames = ref(false)
    const config = reactive({})
    const isDescriptionShown = ref(true)
    const coupons = ref([])

    const avatarSize = computed(() => {
      return isDescriptionShown.value ? 70 : 50
    })

    const iconSize = computed(() => {
      return isDescriptionShown.value ? 40 : 30
    })

    const toggleDescription = () => {
      isDescriptionShown.value = !isDescriptionShown.value
    }

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.mcolor = data.main_color
        config.mfontcolor = data.main_font_color
        config.rewardLayout = data.rewardLayout
        config.pcolor = data.primary_color
      }
    }

    const loadGamifications = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getGamification(passedCompanyId, token)
        .then((result) => {
          let response = result.data
          gamifications.value = response.data
          showGames.value = true
        })
        .catch((err) => {
          showGames.value = false
          let errormsg = err.data.message
          if (errormsg === "NO_GAMIFICATIONS_FOUND") {
            console.error(errormsg)
          }
        })
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

    const loadCoupons = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getCouponList(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          let couponsList = response.data
          coupons.value = couponsList
        })

        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === "NO_SURVEY_FOUND") {
            console.error(errormsg)
          }
          coupons.value = []
        })
    }

    onMounted(() => {
      loadCoupons()
      loadGamifications()
      setupLayout()
    })

    return {
      gamifications,
      showGames,
      config,
      isDescriptionShown,
      avatarSize,
      iconSize,
      coupons,
      toggleDescription,
      beforeEnter,
      enter,
      leave,
    }
  },
}
</script>
<style scoped>
.item-content {
  overflow: hidden;
  opacity: 1;
  margin-top: 35px;
}
.coupon_list {
  display: grid;
  gap: 10px;
}
</style>
