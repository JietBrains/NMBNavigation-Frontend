import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Taro from '@tarojs/taro'
import { getOpenId, login } from './utils/api'

import './app.scss'

const App = createApp({
  onShow(options) {
    console.log("begin!!!")
    tryLogin()
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())


const tryLogin = async () => {
  let taroLoginRes = await Taro.login()
  const code = taroLoginRes.code
  console.log(taroLoginRes)
  // try {
  //   let getOpenIdRes = await getOpenId({
  //     appid: "wx779e1909e689a563",
  //     secret: "0c44946ccebda3da66cc9adaa543c852",
  //     js_code: code,
  //     grant_type: "authorization_code"
  //   })
  //   console.log("获取openId结果", getOpenIdRes)
  //   openId = getOpenIdRes.openid
  //   console.log("获取openId成功", openId)
  //   Taro.setStorageSync('openId', openId)
  // } catch (error) {
  //   console.error("获取openId失败", error)
  // }
  try {
    let loginRes = await login(code)
    console.log("登录成功")
    let token = loginRes.data.token
    console.log("获取token成功", token)
    Taro.setStorageSync('token', token)
  } catch (error) {
    console.error("登录失败", error)
  }

}

export default App
