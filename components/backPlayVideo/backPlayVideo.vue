<template>
  <!-- ../../static/video/xsdz_20210830082225.mp4 -->
  <view class="videoWrap">
    <video
      class="videoPlay"
      id="videoPlay"
      :src="backPlayUrl" 
      object-fit="fill"
      controls
      :muted="isMuted"
      autoplay>
      <cover-image class="muteBtn" :src="hornIcon[hornIndex]" @click="mutedEvent" />
      <cover-image class="rateBtn" :src="rateImg[idx]" @click="rateEvent(idx)" />
    </video>
  </view>
</template>

<script>
  export default {
    name:"backPlayVideo",
    data() {
      return {
        video: {
          context: null, // 视频组件
        },
        rateVal: [1, 1.25, 1.5], // 设置速率值
        rateImg: ["/static/videoIcon/x1.0.png", "/static/videoIcon/x1.25.png", "/static/videoIcon/x1.5.png"], // 速率图标
        idx: 0,
        hornIndex: 0,
        isMuted: false, // 是否静音播放
        hornIcon: ["/static/videoIcon/jingyin-white.png", "/static/videoIcon/horn.png"],
        hornIndex: 1
      };
    },
    props:{
      backPlayUrl: {
        type: String,
        default: ""
      }
    },
    mounted () {
      this.video.context = uni.createVideoContext("videoPlay")
    },
    methods: {
      // 速率事件
      rateEvent (index) {
        this.idx = index + 1
        if (this.idx === 3) {
          this.idx = 0
        }
        this.video.context.playbackRate(this.rateVal[this.idx])
      },
      // 静音事件
      mutedEvent () {
        if (this.hornIndex === 0) {
          this.hornIndex = 1 // 有声音播放
          this.isMuted = false
        } else {
          this.hornIndex = 0 // 静音播放
          this.isMuted = true
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .videoWrap {
    width: 100%;
    .videoPlay {
      width: 100%;
      height: 450rpx;
      .ctrlToggle {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .opacityShow {
        background-color: rgba(0, 0, 0, 0.3);
      }
      .opacityHide {
        background-color: rgba(0, 0, 0, 0);
      }
      .rateBtn {
        position: absolute;
        right: 40rpx;
        top: 50%;
        margin-top: -65rpx;
        width: 55rpx;
        height: 36rpx;
      }
      .muteBtn {
        position: absolute;
        right: 40rpx;
        top: 50%;
        margin-top: 0rpx;
        width: 50rpx;
        height: 36rpx;
      }
    }
  }
</style>
