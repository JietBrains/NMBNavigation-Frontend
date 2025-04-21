import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.scss'
import '@nutui/nutui-taro/dist/style.css'

const App = createApp({
  onShow(options) {
  },
})

App.use(createPinia())

export default App
