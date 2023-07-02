<style lang="less">
.previewWrap{
  height: 100vh;
  width: 100%;
  background-color: #000;
  position: relative;
  .center{
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .backPlayWrap {
      width: 100%;
      .videoWrap {
        width: 100%;
        .muteIcon{
          position: absolute;
          right: 40rpx;
          top: 50%;
          margin-top: 0rpx;
          height: 45rpx;
          width: 45rpx;
        }
        .rateIcon {
          position: absolute;
          right: 36rpx;
          top: 50%;
          margin-top: -65rpx;
          width: 50rpx;
          height: 36rpx;
        }
        // 删除弹窗
        .videoPopup {
          position: absolute;
          top: 50%;
        }
      }
    }
    .switchIconBtn {
      width: 750rpx;
      height: 150rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 25rpx;
      .opertBtn {
        width: 100rpx;
        height: 100rpx;
        line-height: 100rpx;
        border-radius: 50%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #333;
        image{
          width: 40rpx;
        }
      }
      .opertPause {
        width: 140rpx;
        height: 140rpx;
        line-height: 140rpx;
        margin: 0 20rpx;
        background-color: #000;
        .playAndPause {
          width: 140rpx;
          height: 140rpx;
          line-height: 140rpx;
        }
      }
    }
  }
 
  .videoOperation {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #f59a23;
    z-index: 999;
    .opertItem{
      flex: 1;
      text-align: center;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
    }
  }
}
</style>
<template>
  <view class="previewWrap">
    <view class="center">
      <view class="backPlayWrap">
        <video 
        class="videoWrap" 
        id="backPlayVideo" 
        :src="previewUrl" 
        autoplay 
        controls 
        :muted="isMuted" 
        object-fit="fill"
				play-strategy="1"
        enable-play-gesture="false"
        @pause="videoPauseEvent"
        @play="videoPlayEvent"
        @timeupdate="videoTimerUpdateEvent"
        @ended="videoPlayEndEvent">
          <cover-image class="rateIcon" :src="rateImg[idx]" @click="rateEvent(idx)"></cover-image>
          <cover-image class="muteIcon" :src="hornIcon[hornIndex]" @click="hornEvent"></cover-image>
        </video>
      </view>
      <view class="switchIconBtn">
        <button class="opertBtn" @click="backOffVideoEvent" :disabled="index === 0">
          <image src="../../static/videoIcon/backOff.png" mode="widthFix"></image>
        </button>
       <view class="opertBtn opertPause" @click="pauseOrPlayEvent">
          <image class="playAndPause" :src="switchIcon ? '../../static/videoIcon/pause.png' : '../../static/videoIcon/play.png'" mode="widthFix"></image>
        </view>
        <button class="opertBtn" @click="forwardVideoEvent" :disabled="index === len - 1">
          <image src="../../static/videoIcon/forward.png" mode="widthFix"></image>
        </button>
      </view>
    </view>
    <view class="videoOperation" v-if="isOperation">
      <view class="opertItem" @click="shareVideoBtn">分享</view>
      <view class="opertItem" @click="deleteVideoBtn">删除</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        testData: "",
        previewUrl: "", // 视频回放地址
        isOperation: false, // 控制操作按钮显示与隐藏
        switchIcon: false,
        backPlayVideo: null,
        videoListSrc: [],
        len: 0, // 视频列表的长度
        index: 0, // 当前播放视频在 videoListSrc 数组中的索引
        rateImg: ["/static/videoIcon/x1.0.png", "/static/videoIcon/x1.25.png", "/static/videoIcon/x1.5.png"], // 速率图标
        rateVal: [1, 1.25, 1.5], // 设置速率值
        idx: 0,
        isMuted: false, // 是否静音播放
        duration: 0, // 判断视频是否处于暂停还是播放状态
        hornIcon: ["/static/videoIcon/jingyin-white.png", "/static/videoIcon/horn.png"],
        hornIndex: 1
      }
    },
    onLoad (data) {
    	this.previewUrl = data.previewUrl
    	this.index = Number(data.index)
      this.videoListSrc = JSON.parse(uni.getStorageSync("videoListSrc"))
      this.len = this.videoListSrc.length // 获取视频地址长度
    },
    onReady () {
      this.backPlayVideo = uni.createVideoContext("backPlayVideo")
    },
    onNavigationBarButtonTap (val) {
      if (val.type === "menu") {
        this.isOperation = !this.isOperation
      }
    },
    watch: {
      videoListSrc: {
        handler (newVal, oldVal) {
          this.len = this.videoListSrc.length
        }
      }
    },
    
    methods: {
      // 分享视频
      shareVideoBtn () {
        this.$uniapi.showMessageBox("该版本暂不支持分享", "none")
      },
      // 删除视频
      async deleteVideoBtn () {
        const { confirm, cancel } = await this.$uniapi.myShowModal()
				
        if (confirm) {
          const videoPath = this.videoListSrc[this.index]
          this.testData = videoPath
          plus.io.resolveLocalFileSystemURL(videoPath, (entry) => {
            entry.remove((res) => {
              this.removeSuccess()
            }, (err) => {
            })
          })
        }
      },
      
      removeSuccess () {
        this.videoListSrc.splice(this.index, 1)
        if (this.index === this.videoListSrc.length + 1) {
          this.index = this.index - 1
        }
        this.previewUrl = this.videoListSrc[this.index]
        this.isOperation = false
        this.$uniapi.showMessageBox("删除成功!")
      },
      // 视频状态
      videoPauseEvent (e) {
        if (e.type === "pause") {
          this.switchIcon = true
        }
      },
      // 视频开始播放/继续播放时
      videoPlayEvent (e) {
        if (e.type === "play") {
          this.switchIcon = false
        }
      },
      // 播放暂停事件
      pauseOrPlayEvent () {
        this.switchIcon = !this.switchIcon
        if (this.switchIcon) {
          this.backPlayVideo.pause()
        } else {
          this.backPlayVideo.play()
        }
      },
      // 切换时, 初始化视频
      initSwitchVideo () {
        this.idx = 0
        this.hornIndex = 1
        this.isMuted = false
        this.switchIcon = false
      },
      // 后退事件
      backOffVideoEvent () {
        if (this.index === 0) {
          return
        }
        this.initSwitchVideo()
        this.index = this.index - 1
        this.previewUrl = this.videoListSrc[this.index]
      },
      // 前进事件
      forwardVideoEvent () {
        this.initSwitchVideo()
        this.index = this.index + 1
        if (this.index === this.len - 1) {
          this.index = this.len - 1
          this.previewUrl = this.videoListSrc[this.index]
          return
        }
        this.previewUrl = this.videoListSrc[this.index]
      },
      // 速率事件
      rateEvent (index) {
        this.idx = index + 1
        if (this.idx === 3) {
          this.idx = 0
        }
        this.backPlayVideo.playbackRate(this.rateVal[this.idx])
      },
      // 静音事件
      hornEvent () {
        if (this.hornIndex === 0) {
          this.hornIndex = 1 // 有声音播放
          this.isMuted = false
        } else {
          this.hornIndex = 0 // 静音播放
          this.isMuted = true
        }
      },
      // 视频播放到末尾时, 触发事件
      videoPlayEndEvent () {
        this.switchIcon = true
      },
      // 播放进度变化时触发(有问题， 全屏播放视频，在暂停，再退出，图标有问题)
      videoTimerUpdateEvent (e) {
        this.duration = e.detail.duration
      }
    }
  }
</script>

