<template>
  <div v-if="config.logoPosition == 'left'" class="divFlex">
    <div
      :style="`color:${config.mfontcolor} !important`"
      v-text="config.companyName"
      v-if="!config.shortlogo"
      class="center"
    ></div>
    <v-img
      :src="config.shortlogo"
      max-height="50px"
      max-width="100px"
      contain
      v-else
    ></v-img>
    <v-spacer></v-spacer>
    <!--<v-btn
      class="border0px"
      icon
      @click="logout"
      :style="`color:${config.mfontcolor} !important`"
    >
      <v-icon>mdi-export</v-icon>
    </v-btn>-->
  </div>
  <div v-else-if="config.logoPosition == 'right'" class="divFlex">
    <!--    <v-btn-->
    <!--      class="border0px"-->
    <!--      id="logoutBtnPG"-->
    <!--      icon-->
    <!--      @click="logout"-->
    <!--      :style="`color:${config.mfontcolor} !important`"-->
    <!--    >-->
    <!--      <v-icon>mdi-export</v-icon>-->
    <!--    </v-btn>-->
    <v-spacer></v-spacer>
    <div
      :style="`color:${config.mfontcolor} !important`"
      v-text="config.companyName"
      v-if="!config.shortlogo"
      class="center"
    ></div>
    <v-img
      :src="config.shortlogo"
      max-height="80px"
      max-width="100px"
      contain
      v-else
    ></v-img>
  </div>
  <div v-else class="divFlex">
    <v-spacer></v-spacer>
    <div
      :style="`color:${config.mfontcolor} !important`"
      v-text="config.companyName"
      v-if="!config.shortlogo"
      class="center"
    ></div>
    <!-- <v-img
      :src="config.shortlogo"
      max-height="50px"
      max-width="100px"
      contain
      v-else
    ></v-img> -->
    <v-spacer></v-spacer>
    <!--<v-btn
      class="border0px"
      icon
      @click="logout"
      :style="`color:${config.mfontcolor} !important`"
    >
      <v-icon>mdi-export</v-icon>
    </v-btn>-->
  </div>
</template>

<script>
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import Vue from "vue"
export default {
  data() {
    return {
      config: {},
    }
  },
  created() {
    this.setupLayout()
  },
  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "shortlogo", data.logo_image)
        this.$set(this.config, "showLogo", data.showLogo)
        this.$set(this.config, "showMenu", data.showMenu)
        this.$set(this.config, "logoPosition", data.logoPosition)
        this.$set(this.config, "companyName", data.name)
      }
    },

    /** Logout the user. */
    logout() {
      Vue.prototype.$token = null
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "welcome",
        query: {
          company_name: passedCompanyId,
        },
      })

      auth.clearTokens()
    },
  },
}
</script>
<style>
.divFlex {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-right: 40px;
}
.center {
  align-self: center;
}
</style>
