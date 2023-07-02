<style lang="less">
  .settingWrap {
    width: 100%;
    height: 100vh;
    background-color: #f2f2f2;

    .settingTitle {
      color: #000;
      font-size: 14px;
      font-weight: bold;
      padding: 10rpx 0 10rpx 20rpx;
      box-sizing: border-box;
      background-color: #ddd;
    }

    .deviceName {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      height: 80rpx;
      padding: 0 20rpx;
      border-bottom: 1px solid #ddd;

      .moreIcon {
        display: flex;
        // flex: 1;
        // justify-content: flex-end;
        align-items: center;

        .moreImg {
          width: 30rpx;
          margin-left: 10rpx;
        }

        .software {
          font-size: 12px;
          color: #FFFFFF;
          padding: 2rpx;
          box-sizing: border-box;
          border-radius: 4rpx;
          margin-right: 10rpx;
          background-color: #d72825;
        }
      }

      .deviceRecord {
        margin-right: -20rpx;
        transform: scale(0.8);
      }
    }
  }
</style>
<template>
  <view class="settingWrap">
    <view class="settingVideo">
      <view class="settingTitle">视频设置</view>
      <!-- 设备重命名 -->
      <view class="deviceName">
        <view>设备重命名</view>
        <view class="moreIcon" @click="renameDeviceEvent(deviceName)">
          <view>{{deviceName}}</view>
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!-- 设置画质 -->
      <view class="deviceName">
        <view>画质</view>
        <view class="moreIcon">
          <picker :range="picQualityArr" :value="index" @change="settingPicQualityEvent">
            <view>{{picQualityArr[index]}}</view>
          </picker>
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!-- 录像文件时长 -->
      <view class="deviceName">
        <view>录像文件时长</view>
        <view class="moreIcon">
          <picker :range="videotapeTimerArr" :value="indexTimer" @change="videotapeTimerEvent">
            <view>{{videotapeTimerArr[indexTimer]}}</view>
          </picker>
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!-- 录音 -->
      <view class="deviceName">
        <view>录音</view>
        <view class="moreIcon deviceRecord">
          <switch checked="isAudioEnable" @change="recordSoundEvent" color="#DC851F" />
        </view>
      </view>
      <!-- 记录仪喇叭音量 -->
      <view class="deviceName">
        <view>记录仪喇叭音量</view>
        <view class="moreIcon">
          <picker :range="recordHornSoundArr" :value="indexSound" @change="recordHornSoundEvent">
            <view>{{recordHornSoundArr[indexSound]}}</view>
          </picker>
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
    </view>
    <!-- 系统设置 -->
    <view class="settingVideo">
      <view class="settingTitle">系统设置</view>
      <!-- 修改 wifi 密码 -->
      <view class="deviceName" @click="toSkipModifyPwd">
        <view>修改wifi密码</view>
        <view class="moreIcon">
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!-- 记录仪系统升级 -->
      <view class="deviceName" @click="systemUpgradeEvent">
        <view>记录仪设备升级</view>
        <view class="moreIcon">
          <view class="software" v-if="isUpgrade">有新版本</view>
          <view>{{softwareVersion}}</view>
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!-- 格式化TF卡 -->
      <view class="deviceName" @click="clearTFCartEvent">
        <view>格式化TF卡</view>
        <view class="moreIcon">
          <view>{{useBytes}}M</view>
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!-- 恢复出厂设置 -->
      <view class="deviceName" @click="restoreSetingEvent">
        <view>恢复出厂设置</view>
        <view class="moreIcon">
          <image class="moreImg" src="../../static/mine/mine-more.png" mode="widthFix"></image>
        </view>
      </view>
      <!--弹出提示框是否格式化TF卡-->
      <uni-popup ref="popup" type="center">
        <uni-popup-dialog type="warn" title="删除" mode="base" content="是否格式化？" :before-close="true" @close="closePopup"
          @confirm="confirmPopup"></uni-popup-dialog>
      </uni-popup>
      <!--是否恢复出厂设置-->
      <uni-popup ref="resetPopup" type="center">
        <uni-popup-dialog type="warn" title="恢复默认" mode="base" content="是否恢复默认?" :before-close="true" @close="closeResetPopup"
          @confirm="confirmResetPopup"></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        deviceName: "", // 设备名
        picQualityArr: [],
        index: 0, //画质索引
        videotapeTimerArr: ["1分钟", "2分钟", "3分钟", "4分钟", "5分钟"],
        indexTimer: 0, // 录像索引
        isAudioEnable: false, // 录音是否开启
        configParams: null, // 录音参数
        recordHornSoundArr: ["关", "低", "中", "高"], // 记录仪喇叭音量
        indexSound: 0, // 记录仪喇叭音量
        useBytes: 0, // TF卡已用空间
        softwareVersion: "V1.0.0", // 设备版本
        isUpgrade: false, // 是否有新版本
        configParams: [] // 能理解配置
      }
    },
    onShow() {
      uni.$on("getRenameDevice", (val) => {
        this.deviceName = val
      })
    },
    onLoad(val) {
      // console.log(132313, val)
      this.deviceName = val.deviceName
      // 获取视频录制时间
      this.getVideoRecordTimer()
      // 获取录音使能
      this.getRecordEable()
      // 获取TF卡占用空间
      this.getTFUseBytes()
      // 获取记录仪喇叭音量
      this.getAudioOutputVolume()
      // 设备升级参数
      this.getSoftwareVersion()
			
    },
    methods: {
      // 设备升级参数(有问题)
      getSoftwareVersion() {
        const param = {
          "method": "magicBox.getSoftwareVersion",
          "params": {},
          "id": 1050,
          "session": 123456
        }

        this.$axios(param).then((res) => {
          // console.log(183, res)
          if (res.data.result) {
            if (this.softwareVersion !== res.data.params.version.Version) {
              this.softwareVersion = res.data.params.version.Version
              this.isUpgrade = true
            }
          }
        })
      },
      // 获取画质参数
      getPicQuality(pictureQuality) {
        const param = {
          "method": "encode.getConfigCaps",
          "params": {
            "channel": 0,
            "config": this.configParams,
            "stream": "All"
          },
          "id": 1552,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            const qualityType = res.data.params.caps[0].MainFormat[0].Video.ResolutionTypes
            this.picQuality(qualityType)
            this.index = this.getInitPicQuality(pictureQuality)
          }
        })
      },
      // 获取画质数据
      picQuality(qualityType) {
        let qualityArr = []
        for (let key in qualityType) {
          qualityArr.push(this.switchQualityType(qualityType[key]))
        } 
        this.picQualityArr = [...qualityArr]
        // console.log(234234, this.picQualityArr, qualityArr)
      },
      switchQualityType (type) {
        let qualitytp = ""
        if (type === '2592x1944(1944P)') {
          qualitytp = "2592*1944"
        } else if (type === '2688x1520(1520P)') {
          qualitytp = "2688*1520"
        } else if (type === '2304x1296(1296P)') {
          qualitytp = "2304*1296"
        } else if (type === '1080P') {
          qualitytp = "1920*1080(1080P)"
        } else if (type === '1.3M') {
          qualitytp = "1280*960(1.3M)"
        } else if (type === '720P') {
          qualitytp = "1280*720(720P)"
        } else if (type === 'D1') {
          qualitytp = "704*576(D1)"
        } else if (type === 'VGA') {
          qualitytp = "640*480(VGA)"
        } else if (type === 'CIF') {
          qualitytp = "352*288(CIF)"
        } else if (type === '3840x2160(2160P)') {
          qualitytp = "3840*2160"
        }
        return qualitytp
      },
      // 获取记录仪喇叭音量
      getAudioOutputVolume() {
        const param = {
          "method": "configManager.getConfig",
          "params": {
            "name": "AudioOutputVolume"
          },
          "id": 401,
          "session": "6ace252a46ae3e3a1e8ca793dedd45dd"
        }

        this.$axios(param).then((res) => {
          // console.log(123313, res)
          if (res.data.result) {
            const audioOutput = res.data.params.table[0]
            this.tramfromAudioOutput(audioOutput)
          }
        })
      },
      tramfromAudioOutput(audioOutput) {
        if (audioOutput > 50) {
          this.indexSound = 3
        } else if (audioOutput > 25) {
          this.indexSound = 2
        } else if (audioOutput > 0) {
          this.indexSound = 1
        } else if (audioOutput === 0) {
          this.indexSound = 0
        }
      },
      // 获取录音使能, 画质参数
      getRecordEable() {
        const param = {
          "method": "configManager.getConfig",
          "params": {
            "name": "Encode"
          },
          "id": 399,
          "session": "6ace252a46ae3e3a1e8ca793dedd45dd"
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.isAudioEnable = res.data.params.table[0].MainFormat[0].AudioEnable
            this.configParams = res.data.params.table
            let pictureQuality = res.data.params.table[0].MainFormat[0].Video
            // 获取画质参数
            this.getPicQuality(pictureQuality)
           // console.log(111123333, this.index, this.configParams)
          }
        })
      },
      // 获取初始化画质
      getInitPicQuality (val) {
        // console.log(2222, val.CustomResolutionName)
        const typeQuality = val.CustomResolutionName
        let picQualityIndex = 0
        if (typeQuality === "1.3M") { // picQualityArr = [180]
          picQualityIndex = this.getPicQualityIndex("1280*960(1.3M)")
        } else if (typeQuality === "1080P") {
          picQualityIndex = this.getPicQualityIndex("1920*1080(1080P)")
        } else if (typeQuality === "720P") {
          picQualityIndex = this.getPicQualityIndex("1280*720(720P)")
        } else if (typeQuality === "CIF") {
          picQualityIndex = this.getPicQualityIndex("352*288(CIF)")
        } else if (typeQuality === "1520P") {
          picQualityIndex = this.getPicQualityIndex("352*288(1520P)")
        } else if (typeQuality === "1944P") {
          picQualityIndex = this.getPicQualityIndex("2592x1944(1944P)")
        } else if (typeQuality === "1296P") {
          picQualityIndex = this.getPicQualityIndex("2304x1296(1296P)")
        } else if (typeQuality === "VGA") {
          picQualityIndex = this.getPicQualityIndex("640*480(VGA)")
        } else if (typeQuality === "2160P") {
          picQualityIndex = this.getPicQualityIndex("3840x2160(2160P)")
        } else if (typeQuality === "D1") {
          picQualityIndex = this.getPicQualityIndex("704*576(D1)")
        } 
        
        return picQualityIndex
      },
      getPicQualityIndex (val) {
        return this.picQualityArr.findIndex((item) => {
          return item === val
        })
      },
      // 获取TF卡占用空间
      getTFUseBytes() {
        const param = {
          "method": "storage.getDeviceAllInfo",
          "params": "",
          "id": 335,
          "session": 123
        }

        this.$axios(param).then(res => {
          if (res.data.result) {
            const usedBytes = res.data.params.info[0].Detail[0].UsedBytes
            const totleBytes = res.data.params.info[0].Detail[0].TotalBytes
            this.useBytes = Math.ceil((usedBytes / Math.pow(2, 20)) * 10) / 10 // 字节转换
            // console.log(183183, usedBytes, this.useBytes)
          }
        })
      },
      // 获取视频录制时间
      getVideoRecordTimer() {
        const param = {
          method: "configManager.getConfig",
          params: {
            name: "MediaGlobal",
          },
          id: 890,
          session: 123
        }
        this.$axios(param).then((res) => {
          // console.log(381381, res)
          if (res.data.result) {
            this.indexTimer = this.videotapeTimerArr.findIndex((item) => {
              return item === res.data.params.table.PacketLength + "分钟"
            })
            if (this.indexTimer === -1) {
              this.indexTimer = 4
            }
          }
        })
      },
      // 设备重命名事件
      renameDeviceEvent(deviceName) {
				this.$uniapi.goGavigate(`../rename/rename?deviceName=${deviceName}`)
      },
      // 设置画质 (到这里了)
      settingPicQualityEvent(e) {  // picQualityArr  = ["1920*1080(1080P)", "1280*960(1.3M)", "1280*720(720P)"]
        this.index = e.target.value
        let picQualityItem = this.picQualityArr[this.index]
        let { Width, Height, CustomResolutionName} = this.getCustomNameVaule(picQualityItem)
        this.configParams[0].MainFormat[0].Video.CustomResolutionName = CustomResolutionName
        this.configParams[0].MainFormat[0].Video.Width = Width
        this.configParams[0].MainFormat[0].Video.Height = Height
        // console.log(397, this.configParams)
        // 发送请求
        const param = {
          method: "configManager.setConfig", 
          params: {
            name: "Encode", 
            table: this.configParams,
          },
          id: 1551, 
          session: 123
        }

        this.$axios(param).then((res) => {
          // console.log(410410, res)
          if (res.data.result) {
            this.$uniapi.showMessageBox("画质设置成功!")
          }
        })
      },
      // 根据选择的画质, 获取对应的 customResolutionName
      getCustomNameVaule (picQualityVal) {
        // console.log(399, picQualityVal)
        let Width, Height, CustomResolutionName
        if (picQualityVal === "1920*1080(1080P)") {
          Width = 1920
          Height = 1080
          CustomResolutionName = "1080P"
        } else if (picQualityVal === "1280*960(1.3M)") {
          Width = 1280
          Height = 960
          CustomResolutionName = "1.3M"
        } else if (picQualityVal === "1280*720(720P)") {
          Width = 1280
          Height = 720
          CustomResolutionName = "720P"
        }
        
        return {
          Width,
          Height,
          CustomResolutionName
        }
      },
      // 录像时长设置
      videotapeTimerEvent(e) {
        this.indexTimer = e.target.value
        const PacketLength = Number(this.videotapeTimerArr[this.indexTimer].slice(0, 1))
        // 发送请求
        const param = {
          "method": "configManager.setConfig",
          "params": {
            "name": "MediaGlobal",
            "table": {
              "PacketType": 0,
              "PacketLength": PacketLength,
              "PacketSize": 1024,
              "LogRecord": false,
              "LogEncode": false,
              "SnapFormatAs": "MainFormat",
              "OverWrite": 1
            }
          },
          "id": 890,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.$uniapi.showMessageBox("设置成功")
          }
        })
      },
      // 录音事件
      recordSoundEvent(e) {
        this.isAudioEnable = e.target.value
        // 发送请求
        this.configParams[0].MainFormat[0].AudioEnable = e.target.value
        const param = {
          "method": "configManager.setConfig",
          "params": {
            "name": "Encode",
            "table": this.configParams
          },
          id: 429,
          session: "246061522897bfc55b042a1c8e8fd80a"
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.$uniapi.showMessageBox("设置成功")
          }
          // console.log(12313213, res)
        })
      },
      // 记录仪喇叭音量
      recordHornSoundEvent(e) {
        this.indexSound = e.target.value
        let soundVal = 0
        if (this.indexSound === 0) {
          soundVal = 0
        } else if (this.indexSound === 1) {
          soundVal = 25
        } else if (this.indexSound === 2) {
          soundVal = 50
        } else if (this.indexSound === 3) {
          soundVal = 100
        }
        // 发送请求
        const param = {
          "method": "configManager.setConfig",
          "params": {
            "name": "AudioOutputVolume",
            "table": [soundVal],
            "options": []
          },
          "id": 432,
          "session": "246061522897bfc55b042a1c8e8fd80a"
        }
        this.$axios(param).then((res) => {
          // console.log(333, res)
          if (res.data.result) {
            this.$uniapi.showMessageBox("设置成功!")
          }
        })

      },
      // 跳转到修改密码页面
      toSkipModifyPwd() {
        this.$uniapi.goGavigate('../password/password')
      },
      // 记录仪系统升级
      systemUpgradeEvent() {



      },
      // 格式化IF卡 - 弹出取消按钮
      closePopup() {
        this.$refs.popup.close()
      },
      // 格式化IF卡 - 弹出确认按钮
      confirmPopup() {
        const param = {
          "method": "devStorage.getDeviceInfo",
          "params": "",
          "id": 335,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            const name = res.data.params.device.Name
            const fileSystem = res.data.params.device.Partitions[0].FileSystem
            this.stopRecord(name, fileSystem)
          }

        })
      },
      stopRecord(name, fileSystem) {
        const param = {
          "method": "recordManager.stop",
          "params": "",
          "id": 337,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.stopSnap(name, fileSystem)
          }
        })
      },
      stopSnap(name, fileSystem) {
        const param = {
          "method": "snapManager.stop",
          "params": "",
          "id": 337,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.format(name, fileSystem)
          }
        })
      },
      format(name, fileSystem) {
        const param = {
          "method": "devStorage.formatPatition",
          "params": {
            "part": name,
            "fs": fileSystem,
          },
          "id": 338,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.startRecord()
          }
        })
      },
      startRecord() {
        const param = {
          "method": "recordManager.start",
          "params": "",
          "id": 337,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.startSnap()
          }
        })
      },
      startSnap() {
        const param = {
          "method": "snapManager.start",
          "params": "",
          "id": 337,
          "session": 123
        }

        this.$axios(param).then((res) => {
          if (res.data.result) {
            this.useBytes = 0.1
            this.$refs.popup.close()
            this.$uniapi.showMessageBox("格式化成功!")
          }
        })
      },
      // 格式化IF卡 - 显示弹窗
      clearTFCartEvent() {
        this.$refs.popup.open()
      },
      // 恢复出厂设置
      restoreSetingEvent() {
        this.$refs.resetPopup.open()
      },
      closeResetPopup () {
        this.$refs.resetPopup.close()
      },
      confirmResetPopup () {
        this.$refs.resetPopup.close()
        const param = {
          "method":"magicBox.resetSystemEx",
          "params":{
            "type":1,
          },
          "id":1552,
          "session":123
        }
        
        this.$axios(param).then((res) => {
          // console.log(675675, res)
          if (res.data.result) {
            this.$uniapi.showMessageBox("恢复默认成功!")
          }
        })
      }
    }
  }
</script>
