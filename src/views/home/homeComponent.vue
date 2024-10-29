<template>
  <v-card flat tile :style="`background:#fff0 !important`">
    <v-card-text class="flex" v-if="fullyLoaded">
      <component :is="dynamicComponent"></component>
      <!--<scoreboard
              :class="`order${config.pointIndex}`"
              v-if="config.showScoreCard"
            ></scoreboard>
            <incentives 
              v-if="config.hasIncentives"
              :class="`order${config.rewardIndex}`"
            ></incentives>
            <products
              v-if="!config.hasIncentives"
              :class="`order${config.rewardIndex}`"
            ></products>-->
      <tasks :class="`order${config.taskIndex}`">></tasks>
      <!--<contents
              :class="`order${config.contentIndex}`"
              v-if="config.showContent"
            ></contents>
            <cashback
                :class="`order${config.contentIndex}`"
                v-if="config.has_cashback"></cashback>-->
    </v-card-text>
    <v-card-text class="flex" v-if="!fullyLoaded">
      <h1>taras</h1>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted, defineComponent, computed } from "vue"
import companyconfig from "@/core/companyconfig"
//import incentives from "@/components/home/incentivesComponent";
//import products from "@/components/home/productsComponent";
//import scoreboard from "@/components/home/scoreboardComponent.vue";
import tasks from "@/components/home/tasksComponent"
//import contents from "@/components/home/contentsComponent";
//import cashback from "../../components/home/cashback";
//import loginapi from "@/services/loginapi";
//import auth from "@/core/auth";

export default defineComponent({
  components: {
    //incentives,
    //products,
    //scoreboard,
    tasks,
    //contents,
    //cashback,
  },
  setup() {
    const tab = ref("tab1")
    const config = ref({})
    const fullyLoaded = ref(false)
    let styleTag

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.value = {
          mcolor: data.main_color,
          mfontcolor: data.main_font_color,
          showContent: data.showContent,
          showScoreCard: data.showScoreCard,
          pointIndex: data.scorecardOrder,
          rewardIndex: data.rewardOrder,
          contentIndex: data.contentOrder,
          taskIndex: data.taskOrder,
          has_cashback: data.has_cashback,
          hasIncentives: data.has_incentives,
          index_component: data.index_component,
          custom_css: data.layout_custom_css,
          outercolor: data.layout_background_color_outer,
          innercolor: data.layout_background_color_inner,
        }
      }
      fullyLoaded.value = true
    }

    onMounted(() => {
      setupLayout()
      styleTag = document.createElement("style")
      styleTag.appendChild(document.createTextNode(config.value.custom_css))
      document.head.appendChild(styleTag)

      if (typeof window.gtag !== "undefined") {
        window.gtag("event", "NEW_LOYALTY", {
          event_category: "page_open",
          value: "home",
        })
      }
    })

    const dynamicComponent = computed(() => {
      if (config.value.index_component == null) {
        return {}
      }
      return () =>
        import(`@/components/home/${config.value.index_component}.vue`)
    })

    return {
      tab,
      config,
      fullyLoaded,
      dynamicComponent,
    }
  },
})
</script>

<style>
.order1 {
  order: 1;
}
.order2 {
  order: 2;
}
.order3 {
  order: 3;
}
.order4 {
  order: 4;
}
.flex {
  display: flex;
  flex-direction: column;
}
</style>
