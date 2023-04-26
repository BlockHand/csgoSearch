import { createStore } from 'vuex'
import Cookies from 'js-cookie'
const expires = 1
const config = { expires }
const tokenName = `X-User-Token-${import.meta.env.VITE_API_ENV}`
const userInfoName = `X-User-Info-${import.meta.env.VITE_API_ENV}`

export default createStore({
  state() {
    return {
      token: Cookies.get(tokenName) || '',
      info: JSON.parse(Cookies.get(userInfoName) || '{}')
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      Cookies.set(tokenName, token, config)
      state.token = token
    },
    DELETE_TOKEN() {
      Cookies.remove(tokenName, config)
    },
    SET_USER_INFO: (state, info) => {
      Cookies.set(userInfoName, JSON.stringify(info), config)
      state.info = info
    },
    DELETE_USER_INFO() {
      Cookies.remove(userInfoName, config)
    }
  },
  actions: {
    SET_TOKEN({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    DELETE_TOKEN({ commit }) {
      commit('DELETE_TOKEN')
    },
    SET_USER_INFO({ commit }, info) {
      commit('SET_USER_INFO', info)
    },
    DELETE_USER_INFO({ commit }) {
      commit('DELETE_USER_INFO')
    }
  },
  modules: {}
})
