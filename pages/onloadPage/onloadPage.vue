<style lang="less" scoped>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .btn {
      width: 140rpx;
      height: 60rpx;
      position: absolute;
      top: 80rpx;
      right: 42rpx;
      background: #fff0e0;
      border-radius: 40rpx;
      color: #ff8000;
      font-size: 30rpx;
			display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
			border: 1px solid #eee;
    }

    .text {
      margin: 140rpx 0;
      color: #ff8000;
      font-size: 50upx;
    }

    .img1 {
      width: 85vw;
      height: 85vw;
      margin-top: 40rpx;
    }

    .img2 {
      width: 200rpx;
      height: 47rpx;
      margin-bottom: 50rpx;
    }

    image {
      width: 100%;
      height: 100%;
    }
  }
</style>
<template>
  <view class="container">
    <view class="btn" @click="skipToIndexPage">跳过({{counter}})s</view>
    <view class="img1">
      <image src="@/static/index/splash.png" alt="图片未显示">
    </view>
    <view class="text">全心守护每一刻</view>
    <view class="img2">
      <image src="/static/index/logo.png" alt="图片未显示">
    </view>
  </view>
</template>

<script>
	const testModule = uni.requireNativePlugin('Yoso-VideoCompress')
  export default {
    data() {
      return {
        timer: null,
				counter: 5,
				backPlayLists: [],
				videoLists: [],
				videoAppList: []
				
      }
    },
    created () {
      
    },
    mounted() {
			this.timer = setInterval(() => {
				this.counter--
				if (this.counter === -1) {
					this.counter = 5
					clearInterval(this.timer)
					this.$uniapi.goSwitchTab('/pages/index/index')
				}
			}, 1000)
			// 获取手机内存中下载的视频
			this.getAppVideoFileLists()
    },
    methods: {
      skipToIndexPage() {
				clearInterval(this.timer)
        this.$uniapi.goSwitchTab('/pages/index/index')
      },
			// 获取手机 app 视频
			async getAppVideoFileLists () {
				this.backPlayLists.splice(0)
				this.videoLists.splice(0)
				this.videoAppList.splice(0)
				const entries = await this.$common.getAppFile("file:///storage/emulated/0/DCIM/360/video")
				for (let i = 0; i <= entries.length; i++) {
				  let name = entries[i].name
				  let fullPath = 'file:///'+ entries[i].fullPath
				  let fileSuffix = this.getFileSuffix(name)
				  if (fileSuffix === ".mp4") {
				    this.getAppVideoLists(name, fullPath)
				  }
				}
			},
			// 获取手机中录像列表
			async getAppVideoLists(name, fullPath) {
			  let modAppVideoObj = await this.getDateByFileNameVideoInfo(name, fullPath)
			  this.videoAppList.push(modAppVideoObj)
				this.getAppFileVideoLists() // 处理获取的app视频文件
			},
			// 获取文件的后缀名
			getFileSuffix(name) {
			  let dotLastIndex = name.lastIndexOf('.')
			  return name.slice(dotLastIndex)
			},
			// 通过文件名获取文件时间(视频) { name："", date: "2021-09-13", timer: "09:43:43", fullPath: ''}
			async getDateByFileNameVideoInfo(name, fullPath) {
			  let dotLastIdx = name.lastIndexOf(".")
			  let strFileName = name.slice(0, dotLastIdx)
				let strFileType = name.slice(dotLastIdx)
			  let fileNameArr = strFileName.split("_") // ['camera0', '20210913', '09.43.43-09.43.42']
			  let date = fileNameArr[1].slice(0, 4) + '-' + fileNameArr[1].slice(4, 6) + '-' + fileNameArr[1].slice(6, 8) // 2021-09-13
			  let timerArr = fileNameArr[2].split('-') // ['09.43.43', '09.43.42']
			  let timer = timerArr[0].replace(/\./g, ':') // 09:43:43
				let timerEnd = timerArr[1].replace(/\./g, ':') // 09.43.42
				let { width, size, duration } = await this.getAppVideoInfo(fullPath)
				// let coverPath = await this.getVideoCover(fullPath)
				let coverPath = ""
				size = this.computerVideoSize(size)
				return { date, timer, size, width, duration, name, fullPath, coverPath }
			
			},
			// 处理获取的视频列表
			getAppFileVideoLists () {
			  let date = []
			  let modeVideoList = []
			  this.videoAppList.forEach((item) => {
			    date.push(item.date)
			  })
			  date = Array.from(new Set(date))
			  date.sort((a, b) => {
			    return a < b ? 1 : -1
			  })
			  date.forEach((item) => {
			    let modDate = item
			    let modList = []
			    let modObj = {}
			    this.videoAppList.forEach((itm) => {
			      if (modDate === itm.date) {
			        modList.push({
			          timer: itm.timer,
								size: itm.size,
								width: itm.width,
								duration: itm.duration,
			          ischecked: false,
			          name: itm.name,
								coverPath: itm.coverPath,
			          fullPath: itm.fullPath
			        })
			      }
			    })
			    modObj = {
			      date: modDate,
			      lists: modList
			    }
			    modeVideoList.push(modObj)
			  })
			  
			  modeVideoList.forEach((item) => {
			    item.lists.sort((a, b) => {
			      return a < b ? 1 : -1
			    })
			  })
				
			  this.videoLists = [...modeVideoList]
				uni.setStorageSync("videoLists", JSON.stringify(modeVideoList))
			},
			// 获取视频缩略图
			getVideoCover (filePath) {
				return new Promise((resolve, reject) => {
					testModule.getVideoThumb({
					  file: plus.io.convertLocalFileSystemURL(filePath)
					}, res =>{
						let imageSrc =  "file:///" + res.imagePath
						resolve(imageSrc)
					})
				})
			},
			// 获取视频信息(时长, 分辨率, 大小)
			getAppVideoInfo (filePath) {
				return new Promise((resolve, reject) => {
					plus.io.getVideoInfo({
						filePath,
						success: (res) => {
							resolve(res) 
						}
					})
				})
			},
			// 计算视频大小
			computerVideoSize (size) {
				if (size >= 1024 * 1024 *1024) {
					size = Number((size / (1024 * 1024 *  1024)).toFixed(2)) + "G"
				} else if (size >= 1024 * 1024) {
					size = Number((size / (1024 * 1024)).toFixed(2)) + "M"
				} else if (size >= 1024) {
					size = Number((size / (1024)).toFixed(2)) + "K"
				}
				return size
			},
    }
  }
</script>
