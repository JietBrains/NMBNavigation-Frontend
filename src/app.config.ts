export default {
  pages: [
    'pages/home/index',
    'pages/index/index',
    'pages/profile/index',
    'pages/settings/index',
    'pages/search/index',
    "pages/feedback/index", 
    "pages/map/index", 
    "pages/history/index", 
    "pages/findLatest/index",
    "pages/collect/index", 
    "pages/place/index"
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    // 为了绕过微信开发者工具的检查
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/home.png",
        selectedIconPath: "assets/home.png"
      },
      {
        pagePath: "pages/home/index",
        text: "首页",
        iconPath: "assets/home.png",
        selectedIconPath: "assets/home.png"
      }
    ]
  }
}
