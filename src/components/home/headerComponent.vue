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
    <!-- <v-btn-->
    <!--      class="border0px"-->
    <!--      id="logoutBtnPG"-->
    <!--      icon-->
    <!--      @click="logout"-->
    <!--      :style="`color:${config.mfontcolor} !important`"-->
    <!--    >-->
    <!--      <v-icon>mdi-export</v-icon>-->
    <!--    </v-btn> -->
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
    <div v-else class="greeting_container">
      <v-img :src="config.shortlogo" height="40px" width="40px" contain></v-img>
      <div
        class="greeting_name"
        v-text="`${$t('AppScreen.WELCOME_TO')} ${config.companyName}`"
      ></div>
    </div>

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
import { ref, onMounted } from "vue"
import companyconfig from "@/core/companyconfig"
import auth from "@/core/auth"
import { useRouter } from "vue-router"

export default {
  setup() {
    const config = ref({})
    const router = useRouter()

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.value.mcolor = data.main_color
        config.value.mfontcolor = data.main_font_color
        config.value.logoImage = data.logo_image
        config.value.shortlogo = data.shortLogo
        config.value.showLogo = data.showLogo
        config.value.showMenu = data.showMenu
        config.value.logoPosition = data.logoPosition
        config.value.companyName = data.name
      }
    }

    const logout = () => {
      config.value.token = null
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "welcome",
        query: {
          company_name: passedCompanyId,
        },
      })

      auth.clearTokens()
    }

    onMounted(() => {
      setupLayout()
    })

    return {
      config,
      logout,
    }
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

.greeting_container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.greeting_name {
  /* text-transform: uppercase; */
  color: white;
  font-weight: 700;
  font-size: 18px;
}
</style>
