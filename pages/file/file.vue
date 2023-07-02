<style lang="less" scoped>
  .fileTab {
    width: 750rpx;
    height: 75rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000 !important;
    .fileTitle {
      width: 100rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
  }

  .fileTab .isActive::before {
    content: "";
    display: block;
    width: 64rpx;
    height: 8rpx;
    border-radius: 4rpx;
    position: absolute;
    bottom: -2rpx;
    left: 50%;
    margin-left: -36rpx;
    color: #DC851F;
    background-color: #DC851F;
  }

  .fileList {
    padding: 0 10rpx;
    margin-top: 75rpx;
    box-sizing: border-box;
  }
</style>

<template>
  <view class="fileWrap">
    <view class="fileTab">
      <view :class="['fileTitle', idx === 0 ? 'isActive': '']" @click="imageListEvent">图片</view>
      <view :class="['fileTitle', idx === 1 ? 'isActive': '']" @click="videoListEvent">视频</view>
    </view>
    <view class="fileList">
      <FileImage v-if="idx === 0" :imageLists="imageLists" :timer="timer" :status="status" @deleteImageEvent="deleteImageEvent"></FileImage>
      <FileVideo v-else-if="idx === 1" :videoLists="videoLists" :timer="timer" :status="status" @deleteVideoEvent="deleteVideoEvent"></FileVideo>
    </view>
  </view>
</template>

<script>
  import FileImage from "../../components/fileImage/fileImage.vue"
  import FileVideo from "../../components/fileVideo/fileVideo.vue"
	const testModule = uni.requireNativePlugin('Yoso-VideoCompress')
  export default {
    data() {
      return {
        idx: 0,
        imageLists: [],
        imageAppList: [],
        timer: "", // 当前时间
        videoLists: [],
        videoAppList: [],
        status: false
      }
    },
    components: {
      FileImage,
      FileVideo
    },
    onShow() {
      // 隐藏 tabbar
      uni.hideTabBar()
			this.status = false
      // 获取当前时间
      this.timer = this.$common.timer()
			// 获取手机内存下载的图片列表
			this.getAppImageFileLists()
			// 获取手机内存下载的视频列表
			this.getAppVideoFileLists()
    },
    watch: {
      // 返回顶部
      status: {
        handler () {
          uni.pageScrollTo({
            scrollTop: 0,
						duration: 10
          })
        }
      },
			idx: {
				handler () {
					uni.pageScrollTo({
					  scrollTop: 0,
						duration: 10
					})
				}
			}
    },
    onNavigationBarButtonTap(val) {
      if (val.type === "back") {
        uni.switchTab({
          url: '../index/index'
        })
      } else { // 操作执行
        this.status = !this.status
      }
    },
		mounted() {	
		},
    methods: {
			// 获取手机 app 图片
			async getAppImageFileLists () {
				this.imageLists.splice(0)
				this.imageAppList.splice(0)
				this.$uniapi.showMessageBox("加载中...", "loading")
				const entries = await this.$common.getAppFile("file:///storage/emulated/0/DCIM/360/image")
				for (let i = 0; i < entries.length; i++) {
				  const name = entries[i].name
					console.log("获取app图片", name)
				  const fullPath = 'file:///'+ entries[i].fullPath
				  const fileSuffix = this.$common.getFileSuffix(name)
				  if (fileSuffix === ".jpeg") {
				    this.getAppImageLists(name, fullPath) // 通过文件名获取时间信息
				  }
				}
				this.getAppFileImagesLists() // 处理获取的app截图文件
				uni.hideLoading();
			},
			// 获取手机中图片文件列表 ( name: camera0_20210913_09.42.43-09.43.42.mp4 )
			getAppImageLists(name, fullPath) {
			  let modAppImageObj = this.$common.getImageInfoByFileName(name, fullPath)
			  this.imageAppList.push(modAppImageObj)
			},
			// 处理获取的图片列表
			getAppFileImagesLists() {
			  let date = []
			  let modeImageList = []
				let imageListArr = []
			  this.imageAppList.forEach((item) => {
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
			    this.imageAppList.forEach((itm) => {
			      if (modDate === itm.date) {
			        modList.push({
			          timer: itm.timer,
			          ischecked: false,
			          name: itm.name,
			          fullPath: itm.fullPath
			        })
			      }
			    })
			    modObj = {
			      date: modDate,
			      lists: modList
			    }
			    modeImageList.push(modObj)
			  })
			  modeImageList.forEach((item) => {
			    item.lists.sort((a, b) => {
			      return a < b ? 1 : -1
			    })
			  })
				modeImageList.forEach((item1) => {
				  item1.lists.forEach((item2) => {
				    imageListArr.push(item2.fullPath)
				  })
				})
				uni.setStorageSync("imageListSrc", JSON.stringify(imageListArr)) // 保存图片地址
				this.imageLists = [...modeImageList]
			},
			// 获取手机 app 视频
			async getAppVideoFileLists () {
				this.videoLists.splice(0)
				this.videoAppList.splice(0)
				this.$uniapi.showMessageBox("加载中...", "loading")
				const entries = await this.$common.getAppFile("file:///storage/emulated/0/DCIM/360/video")
				for (let i = 0; i <= entries.length; i++) {
				  let name = entries[i].name
				  let fullPath = 'file:///'+ entries[i].fullPath
				  let fileSuffix = this.$common.getFileSuffix(name)
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
				uni.hideLoading();
      },
      // 处理获取的视频列表
      getAppFileVideoLists () {
        let date = []
				let videoListArr = []
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
				modeVideoList.forEach((item1) => {
				  item1.lists.forEach((item2) => {
				    videoListArr.push(item2.fullPath)
				  })
				})
				
        this.videoLists = [...modeVideoList]
				uni.setStorageSync("videoListSrc", JSON.stringify(videoListArr)) // 保存视频地址
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
				let { width, size, duration } = await this.$uniapi.getAppVideoInfo(fullPath)
				let coverPath = await this.getVideoCover(fullPath)
				size = this.$common.computerVideoSize(size)
				return { date, timer, size, width, duration, name, fullPath, coverPath }
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
			// 切换图片模式
      imageListEvent() {
        this.status = false
        this.idx = 0
      },
      // 切换视频模式
      videoListEvent() {
        this.status = false
        this.idx = 1
      },
			changeStatus (val) {
				this.status = val
			},
			// 删除图片
			deleteImageEvent (val) {
				let imageListArr = []
				let modImageLists = []
				this.status = val.status
				const ischeckedArr = val.ischeckedArr
				ischeckedArr.forEach((item) => {
					for (let i = 0; i <= this.imageLists.length - 1; i++) {
						for(let j = 0; j <= this.imageLists[i].lists.length - 1; j++) {
							if (this.imageLists[i].lists[j].name === item.name) {
								this.imageLists[i].lists.splice(j, 1)
							}
						}
					}
				})
				
				for (let k = 0; k <= this.imageLists.length - 1; k++) {
					if (this.imageLists[k].lists.length !== 0) {
						modImageLists.push(this.imageLists[k])
					}
				}
	
				for (let i = 0; i <= modImageLists.length - 1; i++) {
					for(let j = 0; j <= modImageLists[i].lists.length - 1; j++) {
						imageListArr.push(modImageLists[i].lists[j].fullPath)
					}
				}
				this.imageLists = [...modImageLists]
				uni.setStorageSync("imageListSrc", JSON.stringify(imageListArr)) // 保存图片地址
			},
			// 删除视频
			deleteVideoEvent (val) {
				let videoListArr = []
				let modVideoLists = []
				this.status = val.status
				const ischeckedArr = val.ischeckedArr
				ischeckedArr.forEach((item) => {
					for (let i = 0; i <= this.videoLists.length - 1; i++) {
						for(let j = 0; j <= this.videoLists[i].lists.length - 1; j++) {
							if (this.videoLists[i].lists[j].name === item.name) {
								this.videoLists[i].lists.splice(j, 1)
							}
						}
					}
				})
				for (let k = 0; k <= this.videoLists.length - 1; k++) {
					if (this.videoLists[k].lists.length !== 0) {
						modVideoLists.push(this.videoLists[k])
					}
				}
					
				for (let i = 0; i <= modVideoLists.length - 1; i++) {
					for(let j = 0; j <= modVideoLists[i].lists.length - 1; j++) {
						videoListArr.push(modVideoLists[i].lists[j].fullPath)
					}
				}
				this.videoLists = [...modVideoLists]
				uni.setStorageSync("videoListSrc", JSON.stringify(videoListArr)) // 保存视频地址
				
			}
    }
  }
</script>
