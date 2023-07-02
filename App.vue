<script>
	export default {
		onLaunch() {
		},
		async onShow() {
			const location = await this.getLocation()
    },
		onHide() {
		},
		methods: {
			// 获取位置信息
			getLocation() {
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: "wgs84",
						success: (res) => {
							resolve(res)
						}
					})
				})
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
  page {
    background-color: #F2F2F2;
  }
</style>
