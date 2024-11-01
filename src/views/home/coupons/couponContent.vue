<template>
  <v-container>
    <v-card class="mx-auto mb-3" style="width: 100%">
      <div class="root">
        <v-container
          :style="`background-color:${config.pcolor};`"
          class="top_container"
        >
          <div class="icon_container flex">
            <v-avatar
              variant="elevated"
              size="70"
              style="background-color: white"
            >
              <v-icon class="white" :color="config.mfontcolor" size="40"
                >mdi-book-open-variant-outline</v-icon
              >
            </v-avatar>
          </div>
        </v-container>
        <v-card v-if="coupon" style="padding: 5px; margin: 35px 0">
          <v-img :src="coupon.image"></v-img>
          <v-card flat class="description">
            <h3 class="coupon_title">
              {{ coupon.title }}
            </h3>
            <v-btn
              style="margin: 20px 0"
              :href="coupon.content_link"
              target="_blank"
              block
              variant="text"
              :color="config.pcolor"
              class="button_link"
            >
              {{ $t("AppScreen.GET_GUIDE") }}
            </v-btn>
          </v-card>
          <v-card-actions class="back_button">
            <v-btn
              id="receipt-action-btn"
              :color="config.pcolor"
              :style="`color:white !important;background:${config.mcolor}`"
              @click="goBack"
              v-text="$t('LoginScreen.GOBACK')"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import companyconfig from "@/core/companyconfig"
// import { useI18n } from "vue-i18n"
import { useRouter, useRoute } from "vue-router"
import { ref, onMounted } from "vue"

export default {
  components: {},
  props: {},
  setup() {
    const router = useRouter()
    const route = useRoute()
    // const { t } = useI18n()
    const config = ref({})
    const coupon = ref(null)

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.value.mcolor = data.main_color
        config.value.mfontcolor = data.main_font_color
        config.value.rewardLayout = data.rewardLayout
        config.value.pcolor = data.primary_color
      }
    }

    onMounted(() => {
      setupLayout()
      loadCoupon()
    })

    const goBack = () => {
      router.go(-1)
    }

    const loadCoupon = () => {
      const id = route.params.id
      let token = auth.getAccessToken()
      api
        .getCoupon(token, id)
        .then((result) => {
          let response = result.data
          let couponData = response.data
          coupon.value = couponData
        })

        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === "NO_SURVEY_FOUND") {
            console.error(errormsg)
          }
          coupon.value = null
        })
    }

    return {
      config,
      coupon,
      setupLayout,
      goBack,
    }
  },
}
</script>

<style scope>
.root {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon_container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
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
.container-content {
  overflow: hidden;
  opacity: 1;
  margin-top: 10px;
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

.coupon_title {
  font-size: 14px;
  margin-bottom: 10px;
}
.coupon_subtitle {
  font-size: 11px;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 50px;
}
.description {
  margin-top: 20px;
  text-align: center;
}

.content {
  display: flex;
  gap: 5px;
}

.v-img__img {
  position: unset;
}

.button_link {
  font-size: 22px !important;
  font-weight: 700 !important;
}

.back_button {
  justify-content: center;
}
</style>
