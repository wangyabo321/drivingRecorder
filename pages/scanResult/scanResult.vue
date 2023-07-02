<style lang="less" scoped>
 .scanWrap {
   .scanInfo{
     width: 70%;
     margin: 0 auto;
     margin-top: 200rpx;
     padding:20rpx 0 30rpx 0;
     box-sizing: border-box;
     background-color: #fff;
     border-radius: 15rpx;
    .scanTitle {
      text-align: center;
      margin-bottom: 20rpx;
      font-size: 18px;
      font-weight: bold;
    }
    .scanItem{
      display: flex;
      justify-content: center;
      font-size: 18px;
    }
   }
 }
</style>

<template>
  <view class="scanWrap">
    <view class="scanInfo">
      <view class="scanTitle">WIFI基本信息</view>
      <view class="scanItem">
        <view>SSID:</view>
        <view>{{scanInfo.SSID}}</view>
      </view>
      <view class="scanItem">
        <view>PWD:</view>
        <view>{{scanInfo.PWD}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        scanInfo: null
      }
    },
    onLoad (val) {
      this.scanInfo = JSON.parse(val.scanInfo)
    },
    methods: {
      
    }
  }
</script>
