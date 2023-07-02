<style lang="less" scoped>
.modifyPasswordWrap {
  font-size: 14px;
  font-weight: bolder;
  color: #000;
  padding: 0 20rpx;
  box-sizing: border-box;
  .oldPasswordWrap{
    .oldPwdTitle {
      margin: 40rpx 0 35rpx 0;
    }
    .oldPwdInput {
      position: relative;
      .oldPwdIpt {
        border-bottom: 1px solid #ccc;
        height: 45rpx;
        // padding-left: 15rpx;
        box-sizing: border-box;
      }
      .isShowPwd {
        width: 35rpx;
        position: absolute;
        bottom: 10rpx;
        right: 10rpx
      }
    } 
  }
  /* 添加设备按钮样式 */
  .confirmModifyBtn {
    margin-top: 100rpx;
    transform: scale(0.85);
    border-radius: 25px;
    background-color: #DC851F;
  }
  .oldPwdInput /deep/ .input-placeholder {
    font-size: 12px;
    color: #bbb;
  }
}
</style>
<template>
  <view class="modifyPasswordWrap">
    <!-- 请输入旧密码 -->
    <view class="oldPasswordWrap">
      <view class="oldPwdTitle">请输入旧密码</view>
      <view class="oldPwdInput">
        <input type="text" :password="isShowOldPwd" class="oldPwdIpt" v-model="oldPwd" placeholder="请输入旧密码">
        <image class="isShowPwd" src="../../static/password/eye.png" mode="widthFix" @click="isShowOldPwdBtn"></image>
      </view>
    </view>
    <!-- 请输入新密码 -->
    <view class="oldPasswordWrap">
      <view class="oldPwdTitle">请输入新密码</view>
      <view class="oldPwdInput">
        <input type="text" :password="isShowNewPwd" class="oldPwdIpt" v-model="newPwd" placeholder="请输入新密码">
        <image class="isShowPwd" src="../../static/password/eye.png" mode="widthFix" @click="isShowNewPwdBtn"></image>
      </view>
    </view>
    <!-- 请输入确认密码 -->
    <view class="oldPasswordWrap">
      <view class="oldPwdTitle">请输入确认密码</view>
      <view class="oldPwdInput">
        <input type="text" :password="isShowConfirmPwd" class="oldPwdIpt" v-model="confirmPwd" placeholder="请输入确认密码(10-16位字母、数字、特殊符号组合)">
        <image class="isShowPwd" src="../../static/password/eye.png" mode="widthFix" @click="isShowConfirmPwdBtn"></image>
      </view>
    </view>
    <!-- 确认按钮 -->
    <button class="confirmModifyBtn" type="primary" @click="confirmModifyPwdBtn">确认</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        oldPwd: "", // 旧密码
        isShowOldPwd: true, // 是否显示旧密码
        newPwd: "", // 新密码
        isShowNewPwd: "", // 是否显示新密码
        confirmPwd: "", // 确定密码
        isShowConfirmPwd: "", //是否显示确认密码
        wifiName: "rtwap" // wifi名称
      }
    },
    onLoad () {
      // 获取 wifi 密码
      this.getOldPassword()
      // 获取 wifi 名称
      
    },
    methods: {
      // 获取 wifi 密码
      getOldPassword () {
        const param = {
         "method":"RemoteWLanManager.getHostApdConfig",
         "params":null,
         "id":1284,
         "session":"de804258edea1171ea971f3c32aeef39"
        }
        this.$axios(param).then((res) => {
          this.oldPwd = res.data.params.Password
        })
      },
      // 是否显示旧密码
      isShowOldPwdBtn () {
        this.isShowOldPwd = !this.isShowOldPwd 
      },
      // 是否显示旧密码
      isShowNewPwdBtn () {
        this.isShowNewPwd = !this.isShowNewPwd
      },
      // 是否显示确认密码
      isShowConfirmPwdBtn () {
        this.isShowConfirmPwd = !this.isShowConfirmPwd
      },
      // 确认修改密码
      confirmModifyPwdBtn () {
        // 判断新密码是否等于确认密码
        if (this.newPwd !== this.confirmPwd) {
          this.$uniapi.showMessageBox("输入密码不一致")
          return
        }
        // 新密码是否(10-16位数字、字母、符号组合)
        if (!this.$common.passwordVarify(this.newPwd)) {
          this.$uniapi.showMessageBox("密码不符合要求")
          return
        }
                
        // 发送请求
        const param = {
         "method":"RemoteWLanManager.setHostApdConfig",
         "params":{
           "WifiMode":"HostApd",
           "SSID": this.wifiName,
           "Password": this.newPwd,
          },
         "id":1284,
         "session":"de804258edea1171ea971f3c32aeef39"
        }
        this.$axios(param).then((res) => {
          if (res.data.result) {
            uni.showToast({
              title: "密码修改成功!",
              mask: true,
              icon: "success"
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 500)
          }
        })
      }
    }
  }
</script>

