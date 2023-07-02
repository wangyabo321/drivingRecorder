<style lang="less" scoped>
  .aboutWrap {
    .logo {
      background: #ffffff;
      height: 350upx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .imgLogo {
        width: 239upx;
        height: 56upx;
      }
      .version {
        font-size: 36upx;
        font-weight: 400;
        color: #4d4d4d;
        margin-top: 56upx;
      }
    }
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
  }
</style>
<template>
  <view class="aboutWrap">
    <view class="logo">
      <image class="imgLogo" src="../../static/mine/logo.png"></image>
      <view class="version">V{{ versionName }}</view>
    </view>
    <!--APP当前版本-->
    <view class="mineContainer">
      <view class="cache">当前版本</view>
      <view class="more">
        <view>{{ versionName }}</view>
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    <!--官方网站-->
    <view class="mineContainer">
      <view class="cache">官方网站</view>
      <view class="more">
        <view>www.chipup.com</view>
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    <!--用户协议-->
    <view class="mineContainer">
      <view class="cache">用户协议</view>
      <view class="more">
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    <!--免责协议-->
    <view class="mineContainer">
      <view class="cache">免责协议</view>
      <view class="more">
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
    <!--客户电话-->
    <view class="mineContainer">
      <view class="cache">客户电话</view>
      <view class="more">
        <view>400-898-0000</view>
        <image class="moreIcon" src="../../static/mine/mine-more.png"></image>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        versionName: "1.3.7"
      }
    },
    methods: {
      
    }
  }
</script>

