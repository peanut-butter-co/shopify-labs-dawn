/**
 * state
 */
const state = {
  count: 0
}

/**
 * getters
 */
const getters = {}

/**
 * mutations
 */
const mutations = {
  INC_COUNT (state) {
    state.count++;
  }
}

/**
 * actions
 */
const actions = {
  incCount ({ commit }) {
    commit('INC_COUNT');
  }
}

/**
 * export
 */
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}