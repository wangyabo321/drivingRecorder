<style lang="less" scoped>
 @import url("../../common/css/common.less");
 .popup {
   z-index: 999;
 }
</style>

<template>
  <view class="imageWrap" :style="{paddingBottom: status ? '80rpx' : ''}">
    <!-- 图片列表 -->
    <view class="imageContent" v-for="(item, index) in imageLists" :key="index">
      <view class="dateTitle">{{timer == item.date ? "今天" : item.date}}</view>
      <view class="imageMain">
        <view class="imageItem" v-for="(item2, index2) in item.lists" :key="index2">
          <view class="imageTimer">{{item2.timer}}</view>
          <view class="imageBox" @click="previewImageEnvet(item2)">
            <checkbox class="imageCheckbox" v-if="status" :checked="item2.ischecked" :data-date="item.date" :data-index="index2" @click.stop="getSelectEvent($event, item2)"/>
            <image :src="item2.fullPath" mode="widthFix"></image>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作按钮 -->
    <view class="footer" v-if="status">
      <view class="footerItem" @click="shareImage">分享</view>
      <view class="footerItem" @click="deleteImage">删除</view>
      <view class="footerItem" @click="allCheckedImage">全选</view>
    </view>
    
    <!--删除提示信息-->
    <uni-popup ref="delPopup" type="center" class="popup">
      <uni-popup-dialog type="warn" title="删除" mode="base" content="是否删除选中的图片?" :before-close="true" @close="closeDelPopup"
        @confirm="confirmDelPopup"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        isAllChecked: false,
        imageListSrc: []
      }
    },
    props:{
      imageLists: {
        type: Array,
        default: () => { return [] }
      },
      timer:{
        type: String,
        default: ""
      },
      status: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      status: {
        handler (newVal, oldVal) {
          this.imageLists.forEach((item) => {
            item.lists.forEach((item2, index2) => {
              item2.ischecked = false
            })
          })
        }
      }
    },
    methods: {
      // 图片预览
      previewImageEnvet (val) {
        const fullPath = val.fullPath
        const fullIndex = this.imageListSrc.findIndex((item) => {
          return item == fullPath
        })
        this.$uniapi.goGavigate(`../previewImage/previewImage?fullIndex=${fullIndex}`)
      },
      getSelectEvent (e) {
        const {index, date} = e.target.dataset
        this.imageLists.forEach((item) => {
          if (item.date === date) {
            item.lists.forEach((item2, index2) => {
              if (index2 === index) {
                item2.ischecked = !item2.ischecked
              }
            })
          }
        })
      },
      // 封装选中的数据列表
      getCheckedList () {
        let ischeckedArr = []
        this.imageLists.forEach((item) => {
          item.lists.forEach((item2, index2) => {
            if (item2.ischecked) {
              ischeckedArr.push(item2)
            }
          })
        })
        return ischeckedArr
      },
      // 分享图片 (未调通)
      shareImage () {
        this.$uniapi.showMessageBox("该版本暂不支持分享", "none")
        // let ischeckedArr = this.getCheckedList() // 选中的数据
      },
      // 删除本地视频
      closeDelPopup () {
        this.$refs.delPopup.close()
      },
      confirmDelPopup () {
        let ischeckedArr = this.getCheckedList() // 选中的数据
        ischeckedArr.forEach((item) => {
          this.$uniapi.deleteFileFun(item.fullPath)
        })
        this.$uniapi.showMessageBox("删除成功!")
				this.$emit("deleteImageEvent", { ischeckedArr, status: false })
				this.$refs.delPopup.close()
      },
      deleteImage () {
        let ischeckedArr = this.getCheckedList() // 选中的数据
        if (!ischeckedArr.length) {
          this.$emit("changeStatus", false)
          this.$uniapi.showMessageBox("未选择任何数据", "error")
          return
        }
        this.$refs.delPopup.open()
      },
      // 全选封装共用函数
      isAllCheckedFun (ischecked) {
        this.imageLists.forEach((item) => {
          item.lists.forEach((item2, index2) => {
            item2.ischecked = ischecked
          })
        })
        this.isAllChecked = ischecked
      },
      allCheckedImage () {
        if (!this.isAllChecked) {
          this.isAllCheckedFun(!this.isAllChecked)
        } else {
          this.isAllCheckedFun(!this.isAllChecked)
        }
      }
    }
  }
</script>


