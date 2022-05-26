<template>
  <div>
    <h1>Pruebas de props, data y vuex</h1>
    <ul>
      <li
        v-for="(value, key) in shopifyData"
        :key="key"
      >
        {{ key }}: {{ value }}
      </li>
    </ul>

    <slot />

    <div v-if="store">
      Actualmente el store.count es {{ store.state['my-module-2'].count }}
    </div>
    <button @click="incCount()">
      Añadir
    </button>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  props: {
    shopifyData: {
      type: Object,
      required: true
    }
  },

  data: function () {
    return {
      store: null
    }
  },

  mounted: function() {
    this.store = useStore();
    this.store.subscribe((mutation, state) => {
      if(mutation && mutation.type == 'my-module-2/INC_COUNT'){
        this.changedCount(state);
      }
    });
  },

  methods: {
    changedCount: function(state) {
      console.log('count ha cambiado', state['my-module-2'].count);
    },

    incCount: function() {
      this.store.dispatch('my-module-2/incCount');
    }
  }

}
</script>