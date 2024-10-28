<template>
  <v-container>
    <v-row v-if="isSurveyPassed && !isLoading">
      <v-col cols="12">
        <v-card
          class="card"
          flat
          :style="`background-color:${config.innercolor} !important`"
        >
          <v-card-title>
            <h2 class="done_title">{{ $t("AppScreen.SURVEY_ANSWERED") }}</h2>
            <!-- Wypełniłeś już ankietę -->
          </v-card-title>
          <v-card-text class="button">
            <v-btn
              :style="`background-color:${config.mcolor}`"
              @click="navigatehome"
              v-text="$t('LoginScreen.BACK_BTN')"
            ></v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-col cols="12">
        <Loading
          class="spinner"
          v-model:active="isLoading"
          :can-cancel="false"
          loader="dots"
          color="blue"
          :width="spinnerWidth"
        ></Loading>
      </v-col>
    </v-row>
    <iframe class="frame" ref="surveyFrame" frameborder="0"></iframe>
  </v-container>
</template>
<script>
import companyconfig from "@/core/companyconfig"
import api from "@/services/surveyapi"
import fetchapi from "@/services/fetchapi"
import auth from "@/core/auth"
// import alert from "@/components/shared/errorAlert"
import GlobalConfig from "@/variable"
import { NO_SURVEY_DONE } from "@/appConstants"
import Loading from "vue-loading-overlay"

export default {
  data() {
    return {
      isSurveyPassed: null,
      config: {},
      isLoading: true,
      fullPage: true,
      spinnerWidth: 40,
    }
  },
  components: {
    // alert,
    Loading,
  },
  created() {
    this.id = this.$route.params.id
    this.setupLayout()
    this.company = companyconfig.getCompanyIdfromUrl()
    this.accessToken = auth.getAccessToken()
    this.companyId = null
    this.companyUserId = null
  },
  async mounted() {
    try {
      const companyId = localStorage.getItem("company_id")
      const companyUser = await api.getCompanyUserId(companyId)
      this.companyUserId = companyUser.id
      const surveyUrl = this.getSurveyUrl()
      const isSurveyPassed = await this.loadSurveyResults()
      if (isSurveyPassed === false) {
        this.$refs.surveyFrame.src = surveyUrl
      }
      this.disableSpinner()
    } catch (error) {
      console.error("Failed to get company user ID:", error)
    }
  },
  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "layout_has_close", data.layout_has_close)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "showMenu", data.showMenu)
        this.$set(this.config, "menuColor", data.menu_color)
        this.$set(this.config, "menuColorActive", data.menu_color_active)
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
      }
    },
    /**
     * Load survey results
     */
    async loadSurveyResults() {
      let token = auth.getAccessToken()
      try {
        const results = await fetchapi.getUserSurveyHistory(this.company, token)
        this.isSurveyPassed = results?.data?.data?.length > 0
        return results?.data?.data?.length > 0
      } catch (error) {
        if (error.data.message === NO_SURVEY_DONE) {
          this.isSurveyPassed = false
          return false
        }
      }
    },
    /**
     * Navigate tp previous url
     */
    navigate() {
      this.$router.go(-1)
    },
    disableSpinner() {
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    /**
     * Navigate to home page
     */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const targetRoute = {
        name: "home",
        query: { company_name: passedCompanyId },
      }

      // Check if the target route is different from the current route
      const currentRoute = this.$route
      if (
        currentRoute.name !== targetRoute.name ||
        currentRoute.query.company_name !== targetRoute.query.company_name
      ) {
        this.$router.push(targetRoute)
      } else {
        // Optionally handle the case where the navigation is redundant
        console.log(
          "Attempted redundant navigation to current location:",
          targetRoute
        )
      }
    },
    /**
     * Get Url to survey
     */
    getSurveyUrl() {
      return `${GlobalConfig.surveyAppUrl}${this.companyUserId}/survey?companyId=${this.company}&access_token=${this.accessToken}`
    },
  },
}
</script>

<style>
.frame {
  width: 100%;
  height: 90vh;
  margin-top: 10px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
  justify-content: center;
}
.button {
  width: fit-content;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -68%);
  /* transform: translate(-50%, calc(-50% - 47px)); */
}

.done_title {
  word-break: break-word;
  text-wrap: balance;
  text-align: center;
}
</style>
