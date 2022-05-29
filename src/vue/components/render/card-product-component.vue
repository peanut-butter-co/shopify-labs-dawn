<template>

  <div class="card-wrapper underline-links-hover" v-if="settings && card_product" style="height: 500px">
    <div :class="'card' +
      ' card--' + settings.card_style +
      card_product.featured_media ? ' card--media ' : ' card--text ' +
      settings.card_style == 'card' ? 'color-' + settings.card_color_scheme : 'gradient' +
      extend_height ? ' card--extend-height ' : ' ' +
      ! card_product.featured_media && settings.card_style ? ' ratio' : ''"
    >
      <div :class="'card__inner ' +
        settings.card_style == 'standard' ? 'color-' + settings.card_color_scheme + ' gradient' : '' +
        card_product.featured_media || settings.card_style == 'standard' ? ' ratio' : ''"
      >

        <div class="card__media" v-if="card_product.featured_media">
          <div class="media media--transparent media--hover-effect">
          </div>
        </div>

        <div class="card__content">
          <div class="card__information">
            <h3 class="card__heading">
              <a :href="card_product.url" class="full-unstyled-link">
                {{ card_product.title }}
              </a>
            </h3>
          </div>
          <div :class="'card__badge ' + settings.badge_position">
            <span :class="'badge badge--bottom-left color-' + settings.sold_out_badge_color_scheme"
                  v-if="! card_product.available">{{ $t('products.product.sold_out') }}</span>
            <span class="badge badge--bottom-left color-{{ settings.sale_badge_color_scheme }}"
                  v-if="card_product.compare_at_price > card_product.price && card_product.available">{{ $t('products.product.on_sale') }}</span>
          </div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__information">
          <h3 :class="'card__heading' + card_product.featured_media || settings.card_style == 'standard' ? 'h5' : ''">
            <a :href="card_product.url" class="full-unstyled-link">
              {{ card_product.title }}
            </a>
          </h3>
          <div class="card-information">
            <span class="visually-hidden" v-if="settings.show_vendor">{{ $t('accessibility.vendor') }}</span>
            <div class="caption-with-letter-spacing light" v-if="settings.show_vendor">{{ card_product.vendor }}</div>
          </div>
        </div>

        <div :class="'card__badge ' + settings.badge_position">
          <span :class="'badge badge--bottom-left color-' + settings.sold_out_badge_color_scheme"
                v-if="! card_product.available">{{ $t('products.product.sold_out') }}</span>
          <span :class="'badge badge--bottom-left color-' + settings.sale_badge_color_scheme"
                v-if="card_product.compare_at_price > card_product.price && card_product.available">{{ $t('products.product.on_sale') }}</span>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

export default {
  props: {
    card_product: {
      type: Object,
      required: true
    },
    json_settings: {
      type: String,
      required: true
    },
  },

  data: function () {
    return {
      store: null,
      settings: null
    }
  },

  mounted: function() {
    let _settings = window.atob( this.json_settings );
    this.settings = JSON.parse(_settings);
  },

  methods: {
  }

}
</script>