<style scoped lang="less">
.mineContainer {
  width: 750rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  margin-top: 10rpx;
  box-sizing: border-box;
  background-color: #fff;
  .more {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .moreIcon{
      width: 30rpx;
      height: 30rpx;
      margin-left: 8rpx;
    }
  }
}
</style>
<template>
  <view class="mineWrap container">
    <!--清除缓存-->
    <view class="mineContainer" @click="clearCacheEvent">
      <view class="cache">清除缓存</view>
      <view class="more">
        <view>{{cacheSize}}</view>
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    <!--帮助-->
    <view class="mineContainer" @click="toSkipHelp">
      <view class="cache">帮助</view>
      <view class="more">
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    <!--关于-->
    <view class="mineContainer" @click="toSkipAbout">
      <view class="cache">关于</view>
      <view class="more">
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    
    <!--清除缓存对话框-->
    <!--删除提示信息-->
    <uni-popup ref="cachePopup" type="center">
      <uni-popup-dialog type="warn" title="清除缓存" mode="base" :content="content" :before-close="true" @close="closeCachePopup"
        @confirm="confirmCachePopup"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        cacheSize: "0B",
        content: "是否清除缓存?"
      }
    },
    onLoad () {
      // 获取 app 缓存数据
      this.getAppCacheData()
    },
    onNavigationBarButtonTap (val) {
      if (val.index === 0) {
        this.byScanCodeGetcartInfo()
      }
    },
    methods: {
      // 通过扫码获取设备信息
      byScanCodeGetcartInfo () {
        uni.scanCode({
          scanType: ["qrCode"],
          success: (res) => {
            if (res.errMsg === "scanCode:ok") {
              let scanResult = res.result
              if (scanResult.includes("https")) {
                // #ifdef APP-PLUS
                plus.runtime.openURL(scanResult)
                // #endif
              } else {
                let scanInfo = this.getScanCodeInfo(scanResult) // 若传的是对象, 则可以使用 JSON.parse() 转
                this.$uniapi.goGavigate(`../scanResult/scanResult?scanInfo=${scanInfo}`)
              }
              
            }
          },
          fail: (err) => {
            this.$uniapi.showMessageBox("扫码失败!")
          }
        })
      },
      // 获取二维码信息
      getScanCodeInfo (res) {
        let scanStr = res
        let scanInfo = {}
        scanStr = scanStr.replace(/{/g, '')
        scanStr = scanStr.replace(/}/g, '')
        let scanArr = scanStr.split(",")
        scanArr.forEach((item) => {
          let scanMod = item.split(':')
          let scanKey = scanMod[0].trim()
          let scanVal =  scanMod[1].replace(/\"/g, '').trim()
          scanInfo[scanKey] = scanVal
        })
        return JSON.stringify(scanInfo)
      },
      // 获取缓存数据
      getAppCacheData () {
        plus.cache.calculate((size) => {
          let cacheSizeMod = parseInt(size)
          if (cacheSizeMod === 0) {
            this.cacheSize = "0B"
          } else if (cacheSizeMod < Math.pow(2, 10)) {
            this.cacheSize = cacheSizeMod + "B"
          } else if (cacheSizeMod < Math.pow(2, 20)) {
            this.cacheSize = (cacheSizeMod / Math.pow(2, 10)).toFixed(2) + "KB"
          } else if (cacheSizeMod < Math.pow(2, 30)) {
            this.cacheSize = (cacheSizeMod / Math.pow(2, 20)).toFixed(2) + "MB"
          } else if (cacheSizeMod < Math.pow(2, 40)) {
            this.cacheSize = (cacheSizeMod / Math.pow(2, 30)).toFixed(2) + "GB"
          }
        })
      },
      // 清楚缓存-点击弹出弹窗
      clearCacheEvent () {
        this.$refs.cachePopup.open()
      },
      // 点击取消关闭弹窗
      closeCachePopup () {
        this.$refs.cachePopup.close()
      },
      // 点击确定清除缓存信息
      confirmCachePopup () {
        let os = plus.os.name
        if (os === "Android") {
          let main = plus.android.runtimeMainActivity()
          let sdRoot = main.getCacheDir()
          let files = plus.android.invoke(sdRoot, "listFiles")
          let len = files.length
          for (let i = 0; i < len; i++) {
            let filePath = "" + files[i]
            plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
              if (entry.isDirectory) {
                entry.removeRecursively((entry) => {
                  uni.showToast({
                    title: "缓存清理完成!",
                    mask: true,
                    icon: "success"
                  })
                  this.getAppCacheData()
                  this.$refs.cachePopup.close()
                })
              } else {
                entry.remove()
              }
            }, (err) => {
              console.log("文件路径读取失败!", err)
            })
          }
        } else { // ios
          plus.cache.clear(() => {
            uni.showToast({
              title: "缓存清理完成!",
              mask: true,
              icon: "success"
            })
            this.$refs.cachePopup.close()
            this.getAppCacheData()
          })
        }
      },
      toSkipHelp () {
        uni.navigateTo({
          url: "../help/help"
        })
      },
      toSkipAbout () {
        uni.navigateTo({
          url: "../about/about"
        })
      }
    }
  }
</script>

