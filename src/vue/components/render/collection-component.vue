<template>

  <div class="collection{% if section.settings.filter_type != 'vertical' %} page-width{% endif %}" v-if="settings && loaded">
    <div class="loading-overlay gradient"></div>

    <ul id="product-grid" :data-id="id" :class="'grid product-grid grid--' + settings.columns_mobile + '-col-tablet-down'
              + 'grid--' + settings.columns_desktop + '-col-desktop'">
      <li class="grid__item" v-for="(card_product, index) in products_shown" :key="index">
        <render-card-product-component
            :card_product="card_product"
            :json_settings="json_settings">
        </render-card-product-component>
      </li>
    </ul>

  </div>

  <div v-if="! loaded">
    <slot />
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    json_settings: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      store: null,
      settings: null,
      loaded: false,
      products: [],
      products_shown: [],
      items_to_show: 12,
      items_increment: 12,
      actual_page: 1,
      number_of_pages: 1
    }
  },

  mounted: function() {
    let _settings = window.atob( this.json_settings );
    this.settings = JSON.parse(_settings);

    this.store = useStore();
    this.actual_page = this.getInitialPage();

    this.loadData();

    window.addEventListener('scroll', this.handleScroll);
  },

  unmounted () {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    async loadData() {
      const response = await fetch(`${window.location.origin}${window.location.pathname}?view=ajax`);
      const response_json = await response.json();

      this.products = [];
      for (let product of response_json) {
        this.products.push(product);
      }

      this.items_to_show = this.items_increment * this.actual_page
      this.products_shown = this.products.slice(0, this.items_to_show);

      this.loaded = true;
    },

    getInitialPage() {
      let initial_page = 1;
      if (window.location.search.indexOf('page=') > -1) {
        let _search = window.location.search.substring(1);
        for (let keyValue of _search.split('&')) {
          let keyValuePair = keyValue.split('=');
          if (keyValuePair[0] == 'page') {
            initial_page = keyValuePair[1];
          }
        }
      }

      return initial_page;
    },

    handleScroll (event) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 300 ) {
        this.paginate();
      }
    },

    paginate() {
      // Todavía no se han cargado los productos, está en recarga
      if (! this.products.length) {
        return false;
      }

      this.items_to_show += this.items_increment;
      if (this.items_to_show > this.products.length) {
        this.items_to_show = this.products.length;
      }

      this.actual_page = Math.floor(this.items_to_show / this.items_increment);
      this.products_shown = this.products.slice(0, this.items_to_show);

      this.pushState();
    },

    pushState() {
      history.pushState("?page=" + this.actual_page, "" , `${window.location.origin}${window.location.pathname}?page=` + this.actual_page);
    }
  }

}
</script>