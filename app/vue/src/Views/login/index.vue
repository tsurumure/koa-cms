<template>
  <div class="layout-grid layout-theme">
    <div class="layout">
      <el-form :model="loginForm" ref="loginForm" :disabled="$store.state.Login.isLoaded" :rules="rules_login">
        <el-form-item prop="name">
          <span slot="label">账号<a href="javascript:;" v-if="$store.state.Login.CookieUsers.length>0" @click="CLEAR_COOKIE_USERS">清除用户记录</a></span>
          <el-autocomplete v-model="loginForm.name" placeholder="请输入登录账号"
            :fetch-suggestions="searchUsers" :trigger-on-focus="false"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" ref="pwd" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input placeholder="请输入验证码" v-model="loginForm.captcha" @keyup.enter.native="LoginSubmit('loginForm')"></el-input>
            </el-col>
            <el-col :span="6">
                <img :src="Captcha" @click="Change_Captcha(this)" class="vcode_img">
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button class="el-button-full" type="primary" @click="LoginSubmit('loginForm')" :loading="$store.state.Login.isLoading">登录</el-button>
          <el-checkbox v-model="isRemember">记住用户名</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue'
import { Autocomplete } from 'element-ui'
Vue.use(Autocomplete)

import Cookie from 'vue-cookie'
import moment from 'moment'
import { mapActions, mapMutations } from 'vuex'
/* eslint-disable */

export default {
  mounted () {
    if (Cookie.get('token')) {
        this.$router.push({path: '/'})
    } else {
        this.Captcha = `${SConfig.api}/account/captcha`
    //   this.GetCaptcha()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.state.Login.isLoaded = false
    })
  },
  data () {
    return {
        Captcha: '',
        isRemember: false, loginForm: { name: '', password: '', captcha: '' },
        rules_login: {
            name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
            password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, message: '密码不能少于6位', trigger: 'blur' }
            ],
            captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
        }
    }
  },
  methods: {
    ...mapActions({
      'PostLogin': 'Login/PostLogin'
    }),
    ...mapMutations({ 'CLEAR_COOKIE_USERS': 'Login/CLEAR_COOKIE_USERS'}),

    Change_Captcha () {
        this.Captcha = `${SConfig.api}/account/captcha?v=${new Date().valueOf()}`
    },



    searchUsers (...params) { // queryString, cb
      var cu = this.$store.state.Login.CookieUsers
      var results = params[0] ? cu.filter(this.usersFilter(params[0])) : cu
      params[1](results)
    },
    usersFilter (queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },

    AddHistory (loginname) {
      if (Cookie.get('LoginUsers')) {
        let isPush = false
        this.$store.state.Login.CookieUsers.forEach((item) => {
          if (!isPush && item.value === loginname) {
            isPush = true
          }
        })
        if (!isPush) {
          this.$store.state.Login.CookieUsers.push({ value: loginname })
          Cookie.set('LoginUsers', Cookie.get('LoginUsers') + ',' + loginname, { expires: 365 })
        }
      } else {
        this.$store.state.Login.CookieUsers.push({ value: loginname })
        Cookie.set('LoginUsers', loginname, { expires: 365 })
      }
    },
    LoginSubmit (formName) {
      this.loginForm.lastlogin_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.loginForm.ckey = this.$store.state.Login.CaptchaImg.key
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.PostLogin(this.loginForm).then((rs) => {
            this.$refs['loginForm'].clearValidate()
            if (rs.data.code != 0) {
              this.GetCaptcha()
              this.loginForm.password = ''
              this.loginForm.captcha = ''
              this.$refs['pwd'].focus()
              this.$message({ type: 'error', message: rs.data.msg })
            } else {
              // Login Success
              this.$store.state.Login.isLoaded = true
              Cookie.set('token', rs.data.token, { expires: this.$store.state.config.CookieValidTime + 'h' }) // (Day)

              // 添加用户名记录
              if (this.isRemember) this.AddHistory(this.loginForm.name)

              this.$store.commit('SET_TOKEN_HEADER', rs.data.token)

              this.GetCaptcha()
              this.$router.push({ path: '/' })
              this.$message({ type: 'success', message: rs.data.msg })
            }
          })
        }
      })
    }
    //
  }
}
</script>

<style lang="less" scoped>
@import url(login.less);
</style>
