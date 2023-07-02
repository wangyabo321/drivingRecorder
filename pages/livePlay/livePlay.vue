<style lang="less" scoped>
  // 录像文件样式
  .livePlayWrap {
    .replayFileTitle {
      padding: 0 20rpx;
      box-sizing: border-box;
      font-size: 15px;
      height: 80rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .replayIcon {
        .more {
          display: flex;
          align-items: center;
          .fileIcon {}
          .moreInfo {
            width: 45rpx;
          }
        }
      }
      .title {
        display: flex;
      }
    }
    .replayListWrap {
      .replayItem {
        width: 100%;
        height: 140rpx;
        background-color: #fff;
        margin-top: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;
        box-sizing: border-box;
        .leftWrap {
          flex: 1;
          display: flex;
          align-items: center;
          font-size: 14px;

          .imageCheckbox {
            transform: scale(0.8);
          }
        }

        .rightWrap {
          display: flex;
          align-items: center;
          position: relative;
          width: 180rpx;
          height: 120rpx;

          .imageIcon {
            width: 180rpx;
            height: 120rpx;
            border-radius: 10rpx;
          }

          .isLock {
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -20rpx;
            margin-left: -20rpx;
            z-index: 999;
          }
        }
      }
    }
    // 时间样式
    .timerWrap {
      width: 100%;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-top: 1px solid #eee;

      .settingTime {
        display: flex;
        align-items: center;

        .timerIcon {
          margin-right: 15rpx;
          width: 36rpx;
          height: 36rpx;
        }

        .timerText {
          font-size: 14px;
        }
      }

      .fileIcon {
        display: flex;
        align-items: center;

        .fileIconTitle {
          font-size: 14px;
          padding: 8rpx 25rpx;
          box-sizing: border-box;
          border: 1px solid #ccc;
        }

        .icon1 {
          border-right: none;
          border-top-left-radius: 10rpx;
          border-bottom-left-radius: 10rpx;
        }

        .imageIcon {
          border-left: none;
          border-top-right-radius: 10rpx;
          border-bottom-right-radius: 10rpx;
        }
      }
    }
    .operationWrap {
      height: 80rpx;
      background-color: #fff;
      margin-top: 10rpx;
      display: flex;
      align-items: center;
      font-size: 14px;
      .listItem {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .allselectLabel {
          display: flex;
          align-items: center;
          .allSelect {
            transform: scale(0.8);
          }
        }
        .lockSwith {
          transform: scale(0.8);
        }
        .loakTitle {
          margin-left: -8rpx;
        }
      }
      .loadupWrap {
        image {
          width: 48rpx;
          margin-right: 10rpx;
        }
      }
      .deleteWrap {
        image {
          width: 45rpx;
          margin-right: 10rpx;
        }
      }
    }
    .imageCheckbox /deep/ .uni-checkbox-wrapper {
      .uni-checkbox-input {
        border-radius: 50% !important
      }
    }
		// 回直播
		.toLivePlayWrap {
			position: fixed;
			top: 60%;
			right: 0;
			background-color: red;
			width: 130rpx;
			height: 80rpx;
			line-height: 80rpx;
			z-index: 999;
			text-align: center;
			color: #fff;
			border-top-left-radius: 40rpx;
			border-bottom-left-radius: 40rpx;
		}
  }
</style>
<template>
  <view class="livePlayWrap">
    <view class="videoWrap">
      <!-- 视频实时播放插件 -->
      <view class="livePlayContainer videoWrap" v-if="switchLiveAndBack">
        <livePlayVideo :livePlayUrl="livePlayUrl" :deviceName="deviceName"></livePlayVideo>
      </view>
      <!-- 视频回放插件 -->
      <view class="backPlayContainer" v-if="!switchLiveAndBack">
        <backPlayVideo :backPlayUrl="backPlayUrl"></backPlayVideo>
      </view>
    </view>
		
    <view class="replayFileContainer">
      <!-- 录像文件控制栏 -->
      <view class="replayFileTitle">
        <view class="title">
          <view>录像文件</view>
        </view>
        <view class="replayIcon">
          <view class="more">
            <image class="moreInfo" src="../../static/index/more.png" mode="widthFix" @click="showOpertBarEvent">
            </image>
          </view>
        </view>
      </view>
      <view class="timerWrap">
        <view class="settingTime">
          <image class="timerIcon" src="../../static/index/calendar-dark.png"></image>
          <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="getDateChange">
            <view class="timerText">{{date === currentTimer ? "今天" : date}}</view>
          </picker>
        </view>
        <view class="fileIcon">
          <view class="fileIconTitle icon1" @click="getBeforeRoatVideoLists">前路</view>
          <view class="fileIconTitle afterTitle" @click="getafterRoatVideoLists">后路</view>
          <view class="fileIconTitle imageIcon" @click="getimagesLists">图片</view>
        </view>
      </view>
      <!-- 显示操作列表 -->
      <view class="operationWrap" v-if="isShowOpertBar">
        <view class="listItem allSelectWrap">
          <label class="allselectLabel">
            <checkbox class="allSelect" :checked="isAllChecked" @click="changeAllCheckedEvent"/>
            <text>全选</text>
          </label>
        </view>
        <view class="listItem lockWrap">
          <switch class="lockSwith" :checked="isLockStatus" color="#DC851F" @change="lockFileEvent" />
          <text class="loakTitle">锁定</text>
        </view>
        <view class="listItem loadupWrap" @click="downloadFileToAppEvent">
          <image src="../../static/index/upload.png" mode="widthFix"></image>
          <view class="title">下载</view>
        </view>
        <view class="listItem deleteWrap" @click="delectFileToDevice">
          <image src="../../static/index/delete.png" mode="widthFix"></image>
          <view class="title">删除</view>
        </view>
      </view>
    </view>
    <!-- 列表数据 -->
    <view class="replayContainer">
      <scroll-view class="replayListWrap" scroll-y @scrolltolower="getScrollBackPlayData" :style="{height: scrollH + 'px'}">
         <view class="replayItem" v-for="(backPlayItem, index) in backPlayList" :key="index" @click="getClickList(backPlayItem)">
           <view class="leftWrap">
             <checkbox class="imageCheckbox" v-if="isShowOpertBar" :checked="backPlayItem.isChecked" @click.stop="changeCheckboxEvent(backPlayItem)"/>
             <view class="timer">{{backPlayItem.camName}}</view>
           </view>
           <view class="rightWrap">
             <image class="imageIcon" :src="backPlayItem.coverPath.length === 0 ? '../../static/index/xsdz_20210827102259.png' : backPlayItem.coverPath"></image>
             <image class="isLock" :src="backPlayItem.lockFlag ? '../../static/index/lock.png' : '../../static/index/noLock.png'" ></image>
           </view>
         </view>
       </scroll-view>
    </view>
		
		<!-- 跳转到直播页面 -->
		<view class="toLivePlayWrap" @click="toLivePlayEvent">回直播</view>
		<!--删除提示信息-->
		<uni-popup ref="popupBox" type="center">
			<uni-popup-dialog type="warn" title="删除" mode="base" :content="content" :before-close="true"
				@close="closePopup" @confirm="confirmPopup"></uni-popup-dialog>
		</uni-popup>
  </view>
</template>

<script>
	const testModule = uni.requireNativePlugin('Yoso-VideoCompress')
  export default {
    data() {
      return {
				livePlayUrl: "rtsp://admin:admin123@192.168.10.10/camera1/main",
        backPlayUrl: "",
				switchLiveAndBack: true, // 直播与回放之间切换标志符
        deviceName: "", // 设备名
        isShowOpertBar: false, // 默认不显示操作栏
        date: "",
        currentTimer: "",
        findFileSavSize: 0,
        maxItemPerPage: 0,
        backPlayList: [], // 回放列表数组
				imageList: [], // 图片地址
        wHeight: 0, // 页面可视区的高度
        videoH: 0, // 视频的高度
        fileTitleH: 0,
        scrollH: "",
        isAllChecked: false, // 全选标志符
        isLockStatus: false,
				content: "是否删除选中的数据?",
				indexBtn: 0 // 用于标识点击那个按钮
      }
    },
    computed: {
      startDate() {
        return this.getDate('start')
      },
      endDate() {
        return this.getDate('end')
      }
    },
    onLoad(val) {
      // 设置导航栏标题
      this.deviceName = val.deviceName
      uni.setNavigationBarTitle({
        title: this.deviceName
      })
      // 获取当前时间
      this.currentTimer = this.$common.timer("even")
      const date = this.$common.timer("odd")
      // 获取回放列表
      this.getMediaFileDestory(date)
    },
    watch: {
      isShowOpertBar: {
        handler (newVal, oldVal) {
          this.scrollH = newVal ? this.scrollH - 45 : this.scrollH + 45
        }
      },
      backPlayList: {
        handler (newVal, oldVal) {
          this.backPlayList.forEach((item) => {
            item.isChecked = this.isAllChecked
          })
        }
      }
    },
    onReady () {
      // 计算列表的高度
      this.computeListHeight()
    },
    mounted() {
      this.date = this.getDate({
        format: true
      })
    },
    methods: {
      // 计算列表的高度
      computeListHeight () {
        // 获取可使用窗口的高度
        uni.getSystemInfo({
          success: (res) => {
            this.wHeight = res.windowHeight
            // 获取视频组件的高度
            let videoInfo = uni.createSelectorQuery().select(".videoWrap")
            videoInfo.boundingClientRect((data) => {
              this.videoH = data.height
            }).exec()
            // 获取操作组件的高度
            let controlsInfo = uni.createSelectorQuery().select(".replayFileContainer")
            controlsInfo.boundingClientRect((data) => {
              this.fileTitleH = data.height
              // 设置scroll-view的高度
              this.scrollH = (this.wHeight - this.videoH - this.fileTitleH)
            }).exec()
          }
        })
      },
      // 向上滑动获取数据
     async getScrollBackPlayData () {
        // 触底请求数据, 即为上拉加载更多数据
        let len = this.backPlayList.length
        let pages = Math.ceil(this.findFileSavSize / 13)
        if (len >= (pages - 1) * 13 && len <= pages * 13) {
					this.$uniapi.showMessageBox("数据加载完成", false)
          await this.$login.destoryFile() // 销毁
        } else {
					if (this.indexBtn  === 0) {
						this.getMediaFileNextFile()
					} else if (this.indexBtn  === 1) {
						this.$uniapi.showMessageBox("开发中...")
					} else if (this.indexBtn  === 2) {
						this.getimageFileNextFile()
					}
          
        } 
      },
			// 销毁
			async getMediaFileDestory(date) {
				this.backPlayList.splice(0)
				await this.$login.destoryFile()
				await this.$login.createFile()
				const { found, maxItemPerPage } = await this.$login.findFile(date, "sav") // 获取总数据found, 最大页数 maxItemPerPage
				this.findFileSavSize = found
				this.maxItemPerPage = maxItemPerPage
				this.getMediaFileNextFile()
			},
      getMediaFileNextFile () {
        this.$uniapi.myShowLoad("数据加载中...")
        const params = {
          "method":"mediaFileFind.findNextFile",
          "params":{
            "count":13,
            "token":0,
          },
          "id":8600,
          "session":"19dd79c0115a980e4db95b0f4be8a902"
        }
        this.$axios(params).then(res => {
          if (res.data.result) {
            // 对数据进行处理添加一个全选字段标志符
            const infos = res.data.params.infos
						console.log(400, infos)
            this.getBackPlayLists(infos)
            uni.hideLoading()
          }
        })
      },
      // 处理获取的数据(添加标志符字段, 获取缩略图)
      getBackPlayLists (lists) {
        lists.forEach((item) => {
					item["coverPath"] = "" // 缩略图地址
          item["isChecked"] = false
					item["downloadPath"] = this.splitFilePath(item)
					// item["camName"] = this.getFileName(item.camName)
					item["timer"] = this.getTimer(item.StartTime, item.EndTime)
					item["size"] = this.$common.computerVideoSize(item.Length)
        })
        this.isLockStatus = lists.every((item) => {
          return item.lockFlag
        })
        this.backPlayList = this.backPlayList.concat(lists)
        // console.log("获取sd文件:", this.backPlayList)
      },
			// 获取文件名称
			getFileName (name) {
				const dotLastIndex = name.lastIndexOf(".")
				return name.slice(0, dotLastIndex)
			},
			// 获取视频时间
			getTimer (startTimer, endTimer) {
				const timerStart = startTimer.split(" ")
				const timerEnd = endTimer.split(" ")
				const startTime = timerStart[1].split(":")
				const endTime = timerEnd[1].split(":")
				let h = Number(endTime[0]) - Number(startTime[0])
				let m = Number(endTime[1]) - Number(startTime[1])
				let s = Number(endTime[2]) - Number(startTime[2])
				let  totalTimer = h * 3600 + m * 60 + s
				h = Math.floor(totalTimer / 3600)
				m = Math.floor(((totalTimer - h * 3600) / 60))
				s = totalTimer - h * 3600 - m * 60
				h = h >= 10 ? h : "0" + h
				m = m >= 10 ? m : "0" + m
				s = s >= 10 ? s : "0" + s
				return `${m}:${s}`
			},
      // 获取文件路径 (http://192.168.10.10/media/2021-10-15/000/sav/11/Camera0_20211015_11.42.00-11.42.59.sav)
      splitFilePath (item) { 
				const url = "http://192.168.10.10/media"
        const { StartTime, EndTime, WorkDir, Type } = item
        let date = StartTime.trim().slice(0, 10) // 2021-10-13
        let timer = StartTime.trim().slice(11) // 09:42:25
        let hours = timer.split(":")[0]
        let channel = "000"
        let name = this.splitFileName(date, timer, EndTime, Type)
      
        return `${url}/${date}/${channel}/${Type}/${hours}/${name}`
      },
      // 拼接文件名
      splitFileName (date, timer, EndTime, Type) {

        let timerEnd = EndTime.trim().slice(11).split(":").join(".")
        let dateStr = date.split("-").join("")
        let timerStart = timer.split(":").join(".")
        
        return `Camera0_${dateStr}_${timerStart}-${timerEnd}.sav` // 后续需要修改为MP4
      },
      // 获取当前时间
      getDateChange(e) {
        let date = e.target.value
        this.date = date
        let dateArr = date.split('-')
        if (dateArr[1].slice(0, 1) === "0") {
          dateArr[1] = dateArr[1].slice(1)
        }
        if (dateArr[2].slice(0, 1) === "0") {
          dateArr[2] = dateArr[2].slice(1)
        }
        let dateValue = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2]
        this.getMediaFileDestory(dateValue)
        this.backPlayList.splice(0)
      },
      // 获取时间
      getDate(type) {
        return this.$common.timer("even", "picker", type)
      },
      // 跳转到记录仪设置页面
      toSkipSetting() {
        this.$uniapi.goGavigate('../setting/setting')
      },
      // 点击更多显示操作栏
      showOpertBarEvent() {
        this.isShowOpertBar = !this.isShowOpertBar
      },
      // 锁定文件操作
      lockFileEvent (e) {
        this.isLockStatus = e.detail.value
        this.backPlayList.forEach((item) => {
          item["lockFlag"] = this.isLockStatus
        })
        const method = this.isLockStatus ? "storage.lockFile" : "storage.unlockFile"
				this.isShowOpertBar = false
        this.backPlayList.forEach(async (item) => {
          await this.$login.isLockOrUnlockFile(method, item.StartTime, item.EndTime) 
        })
      },
      // 全选事件
      changeAllCheckedEvent() {
        this.isAllChecked = !this.isAllChecked
        this.backPlayList.forEach((item) => {
          item.isChecked = this.isAllChecked
        })
      },
      // 下载文件 (先判断, 是否下载过, 若没有, 在下载)
     async downloadFileToAppEvent () {
				const isCheckedVideoArr = this.getIsCheckedList()
				if (!isCheckedVideoArr.length) {
					this.$uniapi.showMessageBox("未选中任何文件", true, "error")
					return
				}
				this.$uniapi.myShowLoad("下载中...")
				// 获取已下载的文件
				let entries = null
				if (this.indexBtn === 0) {
					entries = await this.$common.getAppFile("file://storage/emulated/0/DCIM/360/video")
				} else if (this.indexBtn === 1) {
					this.$uniapi.showMessageBox("开发中...", true, "error")
					return
				} else if (this.indexBtn === 2) {
					entries = await this.$common.getAppFile("file://storage/emulated/0/DCIM/360/image")
				}
				
				console.log(539539, entries)
				
				let downloadArr = []
				for (let i = 0; i <= entries.length - 1; i++) {
					const dotIndex = entries[i].name.lastIndexOf('.')
					const downloadFileName = entries[i].name.slice(0, dotIndex)
					isCheckedVideoArr.forEach((item, index) => {
						// const name = item.camName.replace(/-/g, "_")
						let name = item.camName.replace(/-/g, "_")
						const dotIndex = name.lastIndexOf(".")
						name = name.slice(0, dotIndex)
						const fileName = name + "_" + item.timer + "_" + item.size // 后续需要修改后缀名
						if (downloadFileName === fileName) {
							isCheckedVideoArr.splice(index, 1)
						}
					})
				}
				console.log(5555555, isCheckedVideoArr)
				if (!isCheckedVideoArr.length) {
					this.isShowOpertBar = false // 关闭操作栏
					this.cancelIsCheckedStatus() // 取消选中状态
					this.$uniapi.showMessageBox("文件已下载", true, "error")
					return
				}
				const isCheckedVideoArrLen = isCheckedVideoArr.length - 1
				isCheckedVideoArr.forEach((item, index) => {
					const fileName = this.connectFileName(item, index)
					const fileType = item.Type
					this.downloadFileEvent(item.downloadPath, fileName, index, isCheckedVideoArrLen, fileType)
				})
			},
			// 拼接文件名称
			connectFileName (item) {
				// const name = item.camName.replace(/-/g, "_")
				let name = item.camName.replace(/-/g, "_")
				const dotIndex = name.lastIndexOf(".")
				name = name.slice(0, dotIndex)
				return name + "_" + item.timer + "_" + item.size
			},
			// 下载函数
			downloadFileEvent(downloadPath, fileName, index, isCheckedVideoArrLen, fileType) {
				console.log(514444444, downloadPath, fileName, index, isCheckedVideoArrLen, fileType)
				const baseUrl = "file://storage/emulated/0/DCIM/360"
				const basePath = fileType === "sav" ? `${baseUrl}/video` : `${baseUrl}/image`
				const filename = fileType === "sav" ? `${basePath}/${fileName}.sav` : `${basePath}/${fileName}.jpeg`
				let dtask = plus.downloader.createDownload(downloadPath, {
						filename,
					}, (d, status) => { // d 为下载的文件对象
						if (status === 200) {
							if (index === isCheckedVideoArrLen) {
								uni.hideLoading()
								this.isShowOpertBar = false // 关闭操作栏
								this.cancelIsCheckedStatus()
								this.$uniapi.showMessageBox("下载完成")
							}
							console.log(515151, d, status)
							const fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename)
							console.log(525252, fileSaveUrl)
						} else {
							plus.downloader.clear(); // 下载失败, 清除下载任务
						}
					})
				dtask.start()
				dtask.addEventListener("statechanged", this.onStateChanged, false)
				
			},
			async onStateChanged(download, status) {
				this.downloadPercentage = status === null ? 0 : Math.round((download.downloadedSize / download.totalSize)*100)
				if(download.state === 4 && status === 200){ // 下载完成 (下载图片, 和下载视频要判断一下, 视频需要获取缩略图)
					console.log("下载成功: " + download.getFileName())
					// const coverPath = await this.getVideoCover(download.getFileName()) // 获取视频缩略图
					// console.log(696969, coverPath)
				}  
			},
			// 暂时无法实现
			getVideoCover(filePath) {
				return new Promise((resolve, reject) => {
					testModule.getVideoThumb({
						file: plus.io.convertLocalFileSystemURL(filePath)
					}, res => {
						console.log(8888, res)
						let imageSrc = "file:///" + res.imagePath
						resolve(imageSrc)
					})
				})
			},
			// 取消选中状态
			cancelIsCheckedStatus () {
				this.backPlayList.forEach((item) => {
					item["isChecked"] = false
				})
			}, 
			// 删除文件
			delectFileToDevice () {
				const isCheckedArr = this.getIsCheckedList() // 通过过滤获取选中的文件
				if (!isCheckedArr.length) {
					this.$uniapi.showMessageBox("未选中任何文件", true, "error")
					return
				}
				const isAllLockStatus = isCheckedArr.every((item) => { // 判断选中的文件是否都锁定
					return item.lockFlag
				})
				if (isAllLockStatus) {
					this.$uniapi.showMessageBox("选中全已锁定", true, "error")
					return
				}
				this.$refs.popupBox.open()
			},
			closePopup () {
				this.$refs.popupBox.close()
			},
			confirmPopup () {
				const backPlayIsCheckedArr = this.getIsCheckedAndUnlockList()
				const len = backPlayIsCheckedArr.length - 1
				console.log(6355555, backPlayIsCheckedArr)
				backPlayIsCheckedArr.forEach(async (item, index) => {
					await this.$login.deleteFile(item.StartTime, item.EndTime)
					this.deleteListIsChecked(item, index, len)
				})
			},
      // 删除列表中的数据
      deleteListIsChecked (data, index, len) {
        let backPlayArr = this.backPlayList.filter((item) => {
          return !(item.StartTime === data.StartTime && item.EndTime === data.EndTime)
        })
				if (index === len) {
					this.isShowOpertBar = false
					this.$refs.popupBox.close()
				}
        this.backPlayList = [...backPlayArr]
      },
			// 返回选中的未锁定的的数据
			getIsCheckedAndUnlockList () {
				const modIsCheckedList = this.backPlayList.filter((item) => {
				  return (item.isChecked && !(item.lockFlag))
				})
				return modIsCheckedList
			},
			// 返回选中的数据
			getIsCheckedList(){
				const isCheckedArr = this.backPlayList.filter((item) => { // 获取选中的文件
				  return item.isChecked
				})
				return isCheckedArr
			},
      // 点击回放列表某一项
      getClickList (backPlayItem) {
        console.log(1231321111, backPlayItem)
        this.backPlayUrl = backPlayItem.path
      },
      // 改变文件选择与未选择状态
      changeCheckboxEvent (it) {
        this.backPlayList.forEach((item) => {
          if (item.StartTime === it.StartTime) {
            item.isChecked = !item.isChecked
          }
        })
        this.isAllChecked = this.backPlayList.every((item) => {
          return item.isChecked
        })
        
      },
      // 获取前路视频列表
      getBeforeRoatVideoLists () {
				this.indexBtn = 0
				this.backPlayList.splice(0)
				this.isShowOpertBar = false
        // 获取回放列表
        this.getMediaFileDestory(this.date)
      },
      // 获取后路视频列表
      getafterRoatVideoLists () {
        this.indexBtn = 1
				this.isShowOpertBar = false
				this.backPlayList.splice(0)
      },
      // 获取截图
      async getimagesLists () {
				this.indexBtn = 2
				this.isShowOpertBar = false
				this.backPlayList.splice(0)
        await this.$login.destoryFile()
        await this.$login.createFile()
        const { found, maxItemPerPage } = await this.$login.findFile(this.date, "jpg") // 获取总数据found, 最大页数 maxItemPerPage
        this.findFileSavSize = found
        this.maxItemPerPage = maxItemPerPage
				console.log(685, found, maxItemPerPage)
				this.getimageFileNextFile()
      },
			getimageFileNextFile () {
			  // this.$uniapi.myShowLoad("数据加载中...")
			  const params = {
			    "method":"mediaFileFind.findNextFile",
			    "params":{
			      "count":13,
			      "token":0,
			    },
			    "id":8600,
			    "session":"19dd79c0115a980e4db95b0f4be8a902"
			  }
			  this.$axios(params).then(res => {
					console.log(700, res.data.params)
			    if (res.data.result) {
			      // 对数据进行处理添加一个全选字段标志符
			      const infos = res.data.params.infos
			      this.getimagesListsInfo(infos)
			    }
			  })
			},
			// 处理获取的数据(添加标志符字段, 获取缩略图)
			getimagesListsInfo (lists) {
			  lists.forEach((item) => {
			    item["isChecked"] = false
					const pathImage = this.getThumbnailPath(item)
					item["coverPath"] = pathImage // 缩略图地址 http://192.168.10.10/media/2021-10-25/004/jpeg/10/Camera4_20211025_10.16.08-10.16.08.jpeg
					// item["camName"] = this.getFileName(item.camName)
					item["downloadPath"] = pathImage
					item["timer"] = this.getTimer(item.StartTime, item.EndTime)
					item["size"] = this.$common.computerVideoSize(item.Length)
			  })
			  this.isLockStatus = lists.every((item) => {
			    return item.lockFlag
			  })
			  this.imageList = this.imageList.concat(lists)
				this.backPlayList = [...this.imageList]
			},
			// 获取缩略图地址
			getThumbnailPath (item) { 
				const url = "http://192.168.10.10/media"
				const { StartTime, EndTime, WorkDir} = item
				let date = StartTime.trim().slice(0, 10) // 2021-10-13
				let timer = StartTime.trim().slice(11) // 09:42:25
				let hours = timer.split(":")[0]
				let channel = "004"
				let type = "jpeg"
				let name = item.camName
				
				return `${url}/${date}/${channel}/${type}/${hours}/${name}`
			},
			// 回直播事件
			toLivePlayEvent () {
				this.switchLiveAndBack = true
			}
    }
  }
</script>
