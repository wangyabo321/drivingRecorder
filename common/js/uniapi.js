const uniapi = {
  // 跳转到应用内的某个页面, 保留当前页面
  goGavigate(url) {
    uni.navigateTo({
      url,
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // 跳转到 tabBar 页面, 并关闭其他所有非 tabBar 页面
  goSwitchTab(url) {
    uni.switchTab({
      url,
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // showToast 显示消息提示框
  showMessageBox (title, mask=true, icon="success") {
    uni.showToast({
      title,
      icon,
			mask,
			duration: 1500,
      fail: (err) => {
        console.log(err)
      }
    })
  },
  // showModal 显示模态弹窗, 带确认和取消按钮
  myShowModal (title, content) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: "删除",
        content: "是否删除当前视频?",
        success: (res) => {
          if (res.confirm) {
            resolve(res)
          } else if (res.cancel) {
            reject(res)
          }
        }
        
      })
    })
  },
	// 显示 loading 提示框
	myShowLoad (title) {
		return new Promise((resolve, reject) => {
			uni.showLoading({
				title,
				mask: true
			})
		})
	},
	
	
	// 封装的删除文件函数
	deleteFileFun (fullPath) {
	  plus.io.resolveLocalFileSystemURL(fullPath, (entry) => {
	    entry.remove((res) => {
	    }, (err) => {
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
	
  
}

export default uniapi
