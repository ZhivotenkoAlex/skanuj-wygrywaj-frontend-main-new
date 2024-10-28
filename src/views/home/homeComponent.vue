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
import companyconfig from "@/core/companyconfig"
//import incentives from "@/components/home/incentivesComponent";
//import products from "@/components/home/productsComponent";
//import scoreboard from "@/components/home/scoreboardComponent.vue";
import tasks from "@/components/home/tasksComponent"
//import contents from "@/components/home/contentsComponent";
//import cashback from "../../components/home/cashback";
//import loginapi from "@/services/loginapi";
//import auth from "@/core/auth";
export default {
  data() {
    return {
      tab: "tab1",
      config: {},
      fullyLoaded: false,
    }
  },
  created() {
    this.setupLayout()
  },
  mounted() {
    this.styleTag = document.createElement("style")
    this.styleTag.appendChild(document.createTextNode(this.config.custom_css))
    document.head.appendChild(this.styleTag)

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "NEW_LOYALTY", {
        event_category: "page_open",
        value: "home",
      })
    }
  },
  computed: {
    dynamicComponent() {
      if (this.config.index_component == null) {
        return {}
      }
      return () =>
        import(`@/components/home/${this.config.index_component}.vue`)
    },
  },
  components: {
    //incentives,
    //products,
    //scoreboard,
    tasks,
    //contents,
    //cashback,
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
        this.$set(this.config, "showContent", data.showContent)
        this.$set(this.config, "showScoreCard", data.showScoreCard)
        this.$set(this.config, "pointIndex", data.scorecardOrder)
        this.$set(this.config, "rewardIndex", data.rewardOrder)
        this.$set(this.config, "contentIndex", data.contentOrder)
        this.$set(this.config, "taskIndex", data.taskOrder)
        this.$set(this.config, "has_cashback", data.has_cashback)
        this.$set(this.config, "hasIncentives", data.has_incentives)
        this.$set(this.config, "index_component", data.index_component)
        this.$set(this.config, "custom_css", data.layout_custom_css)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
      }
      this.fullyLoaded = true
    },
  },
}
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
