<style lang="less" scoped>
.deviceRenameWrap {
  background-color: #fff;
  padding-left: 20rpx;
  font-size: 14px;
  height: 80rpx;
}
.saveName {
  margin-top: 80rpx;
  transform: scale(0.85);
  border-radius: 25px;
  background-color: #DC851F;
  color: #fff;
}
</style>
<template>
  <view class="renameWrap">
		<input type="idcard" class="deviceRenameWrap" v-model="deviceName" @input="getDeviceNameInfo"/>
    <button class="saveName" @click="saveDeviceName(deviceName)">保存</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        deviceName: ""
      }
    },
    onLoad (val) {
      this.deviceName = val.deviceName
    },
    methods: {
			// 修改设备名信息
			getDeviceNameInfo (e) {
				this.deviceName = e.detail.value
			},
      // 保存设备的名称
      saveDeviceName (deviceName) {
        uni.$emit("getRenameDevice", deviceName)
        // 发送请求修改数据
        const param = {
          "method": "configManager.setConfig",
          "params": {
            "name": "General",
            "table": {
              "LocalNo": 123,
              "MachineID": "123",
              "MachineName": deviceName,
              "LockLoginEnable": true,
              "CheckDuration": 30,
              "LockLoginTimes": 5,
              "LoginFailLockTime": 300,
              "MaxOnlineTime": 3600,
              "ActivationTime": "2000-01-01 00:00:00"
            }
          },
          "id": 1080,
          "session": 123
        }
				
        this.$axios(param).then((res) => {
          if (res.data.result) {
            uni.showToast({
              title: "设备名修改成功!",
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


