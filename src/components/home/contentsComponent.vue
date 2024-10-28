<template>
  <div class="divFlexcol">
    <div class="title" :style="`color:${config.pfontcolor} !important`">
      {{ $t("AppScreen.CONTENT_TITLE") }}
    </div>
    <v-carousel
      show-arrows-on-hover
      continuous
      dark
      delimiter-icon="mdi-minus"
      hide-delimiter-background
      height="300px"
    >
      <v-carousel-item v-if="config.content1" class="carouselshaped">
        <v-card
          flat
          class="row row-dense fill-height d-flex justify-space-around"
          :style="`border-color:${config.pcolor} !important;`"
          v-html="config.content1"
        ></v-card>
      </v-carousel-item>
      <v-carousel-item v-if="config.content2" class="carouselshaped">
        <v-card
          flat
          class="fill-height d-flex justify-space-around"
          :style="`border-color:${config.pcolor} !important;`"
          v-html="config.content2"
        ></v-card>
      </v-carousel-item>
      <v-carousel-item v-if="config.content3" class="carouselshaped">
        <v-card
          flat
          class="fill-height d-flex justify-space-around"
          :style="`border-color:${config.pcolor} !important;`"
          v-html="config.content3"
        ></v-card>
      </v-carousel-item>
      <v-carousel-item v-if="config.content4" class="carouselshaped">
        <v-card
          flat
          class="fill-height d-flex justify-space-around"
          shaped
          :style="`border-color:${config.pcolor} !important;`"
          v-html="config.content4"
        ></v-card>
      </v-carousel-item>
      <v-carousel-item v-if="config.content5" class="carouselshaped">
        <v-card
          class="fill-height d-flex justify-space-around"
          :style="`border-color:${config.pcolor} !important;`"
          v-html="config.content5"
        ></v-card>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import companyconfig from "@/core/companyconfig"
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
        this.$set(this.config, "pcolor", data.primary_color)
        this.$set(this.config, "pfontcolor", data.primary_font_color)
        this.$set(this.config, "content1", data.content1)
        this.$set(this.config, "content2", data.content2)
        this.$set(this.config, "content3", data.content3)
        this.$set(this.config, "content4", data.content4)
        this.$set(this.config, "content5", data.content5)
        this.$set(this.config, "has_cashback", data.has_cashback)
      }
    },
  },
}
</script>
<style>
.divFlexcol {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.v-carousel__controls {
  z-index: 0 !important;
}
.carouselshaped .v-carousel__item {
  border-radius: 40px;
}
</style>
