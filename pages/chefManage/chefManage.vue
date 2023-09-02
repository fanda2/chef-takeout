<template>
	<view class="content">
		<view class="chef-manage">
			<view class="top-content">
				<view class="chef-img">
					<view class="img-box">
						<image :src="chefInfo.chefImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="chef-msg">
					<view class="chef-name">
						<view class="left-box">
							姓名：{{chefInfo.chefName}}
						</view>
						<view class="right-box">
							{{chefInfo.chefPrice}}/6道
						</view>
					</view>
					<view class="chef-desc">
						介绍：{{chefInfo.chefDesc}}
					</view>
					<view class="chef-time">
						注册时间：{{chefInfo.chefCreateTime}}
					</view>
				</view>
			</view>
			<view class="order-list">
				<view class="order-list-content">
					<view class="list-item" @click="goOrder(0)">
						<view class="item-ico">
							<image src="../../static/ico/pay.png" mode="aspectFill" alt="待付款"></image>
						</view>
						<view class="item-text">
							待完成订单
						</view>
					</view>
					<view class="list-item" @click="goOrder(1)">
						<view class="item-ico">
							<image src="../../static/ico/historyOrder.png" mode="aspectFill" alt="待付款"></image>
						</view>
						<view class="item-text">
							已完成订单
						</view>
					</view>
				</view>
			</view>
			<view class="control-list">
				<view class="list-item" @click="fixPrice">
					<view class="left-ico">
						<image src="../../static/ico/fix.png" mode="aspectFill" alt="头像" />
					</view>
					<view class="right-text">
						修改价格
					</view>
				</view>
				<view class="list-item" @click="goAddDish">
					<view class="left-ico">
						<image src="../../static/ico/send.png" mode="aspectFill" alt="头像" />
					</view>
					<view class="right-text">
						菜品发布
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading type="pulse" v-if="loading"></zero-loading>
		<u-modal v-model="showDialog"  @confirm="modelConfirm"
			:show-cancel-button="true" title="修改价格">
			<view class="slot-content">
			 <view class="inner-input">
			 	<view class="input-box">
			 	   	<input type="number" v-model="chefPrice" placeholder="请输入修改后的价格">  
			 	</view>
				<view class="unit-box">
					<span>/6道</span>
				</view>
			 </view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				chefInfo: "",
				loading: false,

				//模态框
				showDialog:false,
				chefPrice:0,
			}
		},
		onLoad() {
			let chefInfo = JSON.parse(uni.getStorageSync('userInfo')).chefInfo;
			this.chefId = chefInfo.chefId;
			this.getChefInfo();
		},
		methods: {
			//获取厨师详细信息
			async getChefInfo() {
				let result = await request("/common/GetChef", {
					chefId: this.chefId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `获取信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.chefInfo = result.data.chefInfo;
					this.chefPrice=result.data.chefInfo.chefPrice;
				}
			},
			//菜品发布
			goAddDish() {
				uni.navigateTo({
					url: "/pages/shareFood/shareFood?userType=1"
				})
			},
			//进入订单列表
			goOrder(val) {
				uni.navigateTo({
					url: `/pages/chefOrder/chefOrder?tabType=${val}`
				})
			},
			//修改价格
			fixPrice() {
				this.showDialog = true;
			},
			//模态框按钮确认，
			modelConfirm(){
				if(this.chefPrice.trim()==''){
					this.$refs.uToast.show({
						title: `请填写价格信息`,
						type: 'warning',
					})
					return false;
				}else{
					this.updatePrice();
				}
				
			},
			//执行价格修改函数
			async updatePrice() {
			  // 格式化价格,小数点后两位
			  let price=parseFloat(this.chefPrice);
				let result = await request("/users/ModifyChefPrice", {
					price:price.toFixed(2)
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `价格修改失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `价格修改成功`,
						type: 'success',
					});
					//更新页面显示信息
					this.getChefInfo();
				}
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.chef-manage {
		width: 98%;
		margin: 5px auto;
	}

	.top-content {
		width: 100%;
		height: 160px;
		display: flex;
		justify-content: space-between;
		border: 1px solid #ccc;
		border-radius: 6px;
		background: #f4f4f4;

		.chef-img {
			width: 30%;
			height: 160px;
			display: flex;
			justify-content: center;
			align-items: center;

			.img-box {
				width: 100px;
				height: 150px;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.chef-msg {
			width: 68%;
			color: #333;

			.chef-name {
				height: 30px;
				line-height: 30px;
				font-size: 18px;
				font-weight: 550;
				display: flex;

				.left-box {
					width: 70%;
				}

				.right-box {
					width: 30%;
					font-size: 22rpx;
					font-weight: 550;
					color: orange;
				}
			}

			.chef-desc {
				padding: 0 5px;
				line-height: 20px;
				min-height: 80px;
				margin: 6px auto;
				display: -webkit-box;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
				/*没置超出部分显示省略号 */
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.chef-time {
				padding: 4px 0;
			}
		}
	}

	.order-list {
		&-content {
			width: 96%;
			margin: 10px auto;
			padding: 20px 5px;
			display: flex;
			justify-content: space-around;
			border-radius: 6px;
			border: 1px solid #ccc;
			background: #f9f9f9;

			.list-item {
				width: 20%;
				height: 80px;

				.item-ico {
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 40px;
						height: 40px;
					}
				}

				.item-text {
					height: 30px;
					line-height: 30px;
					text-align: center;
				}
			}
		}
	}

	.control-list {
		width: 90%;
		margin: 0 auto;

		.list-item {
			display: flex;
			height: 60px;
			margin-top: 5px;
			border-bottom: 1px solid #333;

			.left-ico {
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 45px;
					height: 45px;
				}
			}

			.right-text {
				line-height: 60px;
				padding: 0 20px;
				font-size: 16px;

			}
		}
	}
	// 模态框插槽样式
	.slot-content{
		width: 100%;
		height: 80px;
		.inner-input{
			color: #333;
			width: 80%;
			margin: 0 auto;
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.input-box{
				height: 40px;
				input{
					height: 40px;
					border: 1px solid #ccc;
					padding: 0 5px;
				}
			}
			.unit-box{
				height: 40px;
				line-height: 40px;
			}
		}
	}
</style>