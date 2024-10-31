<template>
  <v-card style="padding: 5px">
    <div class="content">
      <v-img
        height="170"
        src="https://cdn.2take.it/v2/intermag/172500428566d179fd8058b9.28822340.png"
      ></v-img>
      <v-card flat link @click="navigateContent" class="description">
        <p class="coupon_title">Rola gleby w produkcji rolnej - poradnik</p>
        <p class="coupon_subtitle">
          W Poradniku definiujemy podstawowe parametry odpowiadające za na
          żyzność i zdrowotność gleby oraz wskazujemy działania mające na celu
          poprawę jej właściwości, produktywności i zapobiegające jej
          degradacji. Zwracamy też uwagę na niezwykle ważną rolę, jaką pełnią w
          tych działaniach mikroorganizmy glebowe.
        </p>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { GamificationType } from "@/appConstants"
// import api from "@/services/fetchapi"
// import auth from "@/core/auth"
import companyconfig from "@/core/companyconfig"
// import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { ref, computed, onMounted } from "vue"

export default {
  components: {},
  props: {},
  setup() {
    const router = useRouter()

    // const { t } = useI18n()
    const isDescriptionShown = ref(true)
    const tab = ref("1")
    const surveyName = ref("")
    const results = ref([])
    const type = ref("LIST")
    const config = ref({})
    const inviteCode = ref("")

    const avatarSize = computed(() => {
      return isDescriptionShown.value ? 70 : 50
    })

    const iconSize = computed(() => {
      return isDescriptionShown.value ? 40 : 30
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

    onMounted(() => {
      setupLayout()
    })

    const navigateContent = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "couponContent",
        params: { id: 1 },
        query: { company_name: passedCompanyId },
      })
    }

    return {
      GamificationType,
      isDescriptionShown,
      tab,
      surveyName,
      results,
      type,
      config,
      inviteCode,
      avatarSize,
      iconSize,
      setupLayout,
      navigateContent,
    }
  },
}
</script>

<style scoped>
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
  min-width: 50%;
  max-width: 60%;
}

.content {
  display: flex;
  gap: 5px;
}

.v-img__img {
  position: unset;
}
</style>
