<style lang="less" scoped>
.previewImageWrap {
  width: 100%;
  height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #000;
  .swiperItem {
    width: 750rpx;
    height: 400rpx;
    .imageItem {
      width: 100%;
    }
  }
}
// 底部样式
  .footer{
    position: fixed;
    bottom: 0;
    left:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750rpx;
    height: 80rpx;
    background-color: #f59a23;
    color: #fff;
    font-size: 15px;
    z-index: 999;
    .footerItem{
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
    }
  }
</style>
<template>
  <view>
    <div class="previewImageWrap" @click.stop="backPrePageEvent">
      <swiper :interval="3000" :duration="500" :current="currentIndex" @change="getCurrentIndexEvent">
        <swiper-item class="swiperItem" v-for="(imageItem, index) in imageListSrc" :key="index">
          <image class="imageItem" :src="imageItem" mode="widthFix"></image>
        </swiper-item>
      </swiper>
    </div>
     <!-- 底部操作按钮 -->
    <view class="footer" v-if="isStatus">
      <view class="footerItem" @click.stop="shareImage">分享</view>
      <view class="footerItem" @click.stop="deleteImage">删除</view>
    </view>
    <!--删除提示信息-->
    <uni-popup ref="delSinglePopup" type="center">
      <uni-popup-dialog type="warn" title="删除" mode="base" content="是否删除当前图片?" :before-close="true" @close="closeDelSinglePopup"
        @confirm="confirmDelSinglePopup"></uni-popup-dialog>
    </uni-popup>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        currentIndex: 0,
        imageListSrc: [],
        isStatus: false,
      }
    },
    onNavigationBarButtonTap (val) {
      if (val.type === "menu") {
        this.isStatus = !this.isStatus
      }
    },
    onLoad (val) {
      this.currentIndex = Number(val.fullIndex)
      this.imageListSrc = JSON.parse(uni.getStorageSync("imageListSrc"))
    },
    methods: {
      // 获取当前滑块的索引
      getCurrentIndexEvent (event) {
        this.currentIndex = event.detail.current
        this.isStatus = false
      },
      // 返回上一个页面
      backPrePageEvent () {
        uni.navigateBack({
          delta: 1
        })
      },
      // 分享
      shareImage () {
        this.$uniapi.showMessageBox("该版本暂不支持分享", "none")
      },
      // 删除
      deleteImage () {
        this.$refs.delSinglePopup.open()
      },
      closeDelSinglePopup () {
        this.$refs.delSinglePopup.close()
      },
      confirmDelSinglePopup () {
        const imagePath = this.imageListSrc[this.currentIndex] 
        plus.io.resolveLocalFileSystemURL(imagePath, (entry) => {
          entry.remove((res) => {
            this.removeSuccess()
          }, (err) => {
            console.log(119, err)
          })
        })
      },
      removeSuccess () {
        this.imageListSrc.splice(this.currentIndex, 1)
        if (this.currentIndex === this.imageListSrc.length + 1) {
          this.currentIndex = this.currentIndex - 1 
        }
        this.$refs.delSinglePopup.close()
        this.$uniapi.showMessageBox("删除成功!")
        this.isStatus = false
      }
    }
  }
</script>

