<style lang="less" scoped>
	@import url("../../common/css/common.less");

	.imageBox {
		position: relative;
		font-size: 10px;
		color: #fff;

		.playBtn {
			width: 60rpx !important;
			height: 60rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -30rpx;
			margin-left: -30rpx;
		}

		.resolutRatio {
			position: absolute;
			top: 4rpx;
			right: 6rpx;
		}

		.playTime {
			position: absolute;
			left: 6rpx;
			bottom: 8rpx;
		}

		.videoSize {
			position: absolute;
			bottom: 8rpx;
			right: 6rpx;
		}
	}

	.popup {
		z-index: 999;
	}
</style>

<template>
	<view class="imageWrap" :style="{paddingBottom: status ? '80rpx' : ''}">
		<!-- 视频列表 -->
		<view class="imageContent" v-for="(item, index) in videoLists" :key="index">
			<view class="dateTitle">{{timer == item.date ? "今天" : item.date}}</view>
			<view class="imageMain">
				<view class="imageItem" v-for="(item2, index2) in item.lists" :key="index2">
					<view class="imageTimer">{{item2.timer}}</view>
					<view class="imageBox" @click="toSkipVideoPreview(item2)">
						<checkbox class="imageCheckbox" v-if="status" :checked="item2.ischecked" :data-date="item.date"
							:data-index="index2" @click.stop="getSelectEvent($event, item2)" />
						<image :src="item2.coverPath" mode="widthFix"></image>
						<!-- 添加播放图标 -->
						<image class="playBtn" src="../../static/videoIcon/play-white.png"></image>
						<!-- 添加播分辨率 -->
						<view class="resolutRatio">{{item2.width}}P</view>
						<!-- 添加播分辨率 -->
						<view class="playTime">{{item2.duration}}</view>
						<!-- 添加播分辨率 -->
						<view class="videoSize">{{item2.size}}</view>
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
		<uni-popup ref="delVideoPopup" type="center" class="popup">
			<uni-popup-dialog type="warn" title="删除" mode="base" content="是否删除选中的视频?" :before-close="true"
				@close="closeDelVideoPopup" @confirm="confirmDelVideoPopup"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAllChecked: false,
				videoListSrc: [] // 视频地址
			}
		},
		props: {
			videoLists: {
				type: Array,
				default: () => {
					return []
				}
			},
			timer: {
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
				handler(newVal, oldVal) {
					this.videoLists.forEach((item) => {
						item.lists.forEach((item2, index2) => {
							item2.ischecked = false
						})
					})
				}
			}
		},
		mounted () {
			this.videoListSrc = JSON.parse(uni.getStorageSync("videoListSrc"))
		},
		methods: {
			// 点击跳转视频预览界面
			toSkipVideoPreview(item) {
				const previewUrl = item.fullPath
				const index = this.videoListSrc.findIndex((item) => {
					return item === previewUrl
				})
				this.$uniapi.goGavigate(`../previewVideo/previewVideo?previewUrl=${previewUrl}&index=${index}`)
			},
			getSelectEvent(e) {
				const {
					index,
					date
				} = e.target.dataset
				this.videoLists.forEach((item) => {
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
			getCheckedList() {
				let ischeckedArr = []
				this.videoLists.forEach((item) => {
					item.lists.forEach((item2, index2) => {
						if (item2.ischecked) {
							ischeckedArr.push(item2)
						}
					})
				})
				return ischeckedArr
			},
			// 分享视频
			shareImage() {
				this.$uniapi.showMessageBox("该版本暂不支持分享", "none")
			},
			// 删除本地视频
			closeDelVideoPopup() {
				this.$refs.delVideoPopup.close()
			},
			confirmDelVideoPopup() {  //
				let modVideoList = []
				let ischeckedArr = this.getCheckedList() // 选中的数据
				ischeckedArr.forEach((item) => {
					this.$uniapi.deleteFileFun(item.fullPath)
				})
				this.$emit("deleteVideoEvent", { ischeckedArr, status: false })
				this.$uniapi.showMessageBox("删除成功!")
				this.$refs.delVideoPopup.close()
			},
			deleteImage() {
				let ischeckedArr = this.getCheckedList() // 选中的数据
				if (!ischeckedArr.length) {
					this.$emit("changeStatus", false)
					this.$uniapi.showMessageBox("未选择任何数据", "error")
					return
				}
				this.$refs.delVideoPopup.open()
			},
			// 全选封装共用函数
			isAllCheckedFun(ischecked) {
				this.videoLists.forEach((item) => {
					item.lists.forEach((item2, index2) => {
						item2.ischecked = ischecked
					})
				})
				this.isAllChecked = ischecked
			},
			allCheckedImage() {
				if (!this.isAllChecked) {
					this.isAllCheckedFun(!this.isAllChecked)
				} else {
					this.isAllCheckedFun(!this.isAllChecked)
				}
			}
		}
	}
</script>
