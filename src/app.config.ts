export default {
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#333',
    selectedColor: '#1AAD19',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        // iconPath: 'assets/home.png',
        // selectedIconPath: 'assets/home-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        // iconPath: 'assets/profile.png',
        // selectedIconPath: 'assets/profile-active.png'
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        // iconPath: 'assets/settings.png',
        // selectedIconPath: 'assets/settings-active.png'
      }
    ]
  }
}
