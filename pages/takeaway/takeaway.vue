<template>
	<view class="content">
		<u-navbar :is-back="false" title="">
			<view class="slot-wrap">
				<view class="select-btn" @click="pickerShow=true">
					厨神-{{multiSelector[0][selected[0]].cname}}-{{multiSelector[1][selected[1]].cname}}-{{multiSelector[2][selected[2]].cname}}
					<!-- 厨神-{{multiSelector[0][selected[0]].cname}} - {{multiSelector[1][selected[1]]}} - {{multiSelector[2][selected[2]]}} -->
				</view>
				<view class="img-box">
					<image src="../../static/ico/down.png" mode="aspectFill"></image>
				</view>
			</view>
		</u-navbar>
		<view class="chef-list">
			<view class="list-item" v-for="(item,index) in chefList" :key="index" @click="goChefDetail(item.chefId)">
				<view class="chef-avatar">
					<view class="img-box">
						<image :src="item.chefImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="chef-content">
					<view class="chef-introduce">
						厨师介绍：{{item.chefDesc}}
					</view>
					<view class="control-btn">
						<view class="inner-box">
							<view class="like inner-box-item">
								<view class="item-ico">
									<image src="../../static/ico/like.png" mode="aspectFill"></image>
								</view>
								<view class="item-text">
									{{item.chefLike}}
								</view>
							</view>
							<view class="chat inner-box-item" @click.stop="goChat(item.chefId)">
								<view class="item-ico">
									<image src="../../static/ico/chat.png" mode="aspectFill"></image>
								</view>
								<view class="item-text">

								</view>
							</view>
							<view class="price inner-box-item" @click.stop="createOrder(item.chefId)">
								<view class="item-ico">
									<image src="../../static/ico/price.png" mode="aspectFill"></image>
								</view>
								<view class="item-text">
									{{item.chefPrice+"/道"}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-picker v-model="pickerShow" mode="multiSelector" :default-selector='selected' @columnchange="columnchange"
			:range="multiSelector" range-key="cname" @confirm="confirmBtn"></u-picker>
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				chefList: [

				],
				queryInfo: {
					page: 1,
					size: 10,
				},
				pickerShow: false,
				multiSelector: [
					[{
						placeId: 0,
						cname: "全部"
					}],
					[{
						placeId: 0,
						cname: "全部"
					}],
					[{
						placeId: 0,
						cname: "全部"
					}]
				],
				selected: [0,0,0],

				//默认为0，获取所有
				placeId: 0,

			}
		},
		onLoad() {
			//获取所有地区
			this.getPlaceList(1);
		},
		onShow() {
			//获取厨师信息列表
			this.getChefList();
		},
		methods: {
			//获取厨师信息
			async getChefList() {
				const res = await request('/common/GetChefList', {
					page: this.queryInfo.page,
					size: this.queryInfo.size,
					placeId: this.placeId == 0 ? undefined : this.placeId,
				});
				if (res.code !== 200) {
					this.$refs.uTips.show({
						title: '数据请求异常',
						type: 'warning',
						duration: '2000'
					})
				} else {
					this.chefList = res.data.chefList;
				}
			},
			//列发生变化
			async columnchange(val) {
				//表示第一列变化
				this.selected[val.column] = val.index;
				if (val.column == 0) {
					this.selected = [val.index, 0, 0];
					this.getPlaceList(2, this.multiSelector[0][val.index].placeId);
				} else if (val.column == 1) {
					this.selected[2] = 0;
					this.getPlaceList(3, '', this.multiSelector[1][val.index].placeId);
				}
				console.log(this.selected)
			},
			//点击确认按钮
			confirmBtn() {
				console.log(this.multiSelector)
				if (this.selected[2] == 0) {
					if (this.selected[1] == 0) {
						if (this.selected[0] !== 0) {
							this.placeId = this.multiSelector[0][this.selected[0]].placeId;
						}
					} else {
						this.placeId = this.multiSelector[1][this.selected[1]].placeId;
					}
				} else {
					this.placeId = this.multiSelector[2][this.selected[2]].placeId;
				}
				this.getChefList();
			},
			//进入聊天页面
			goChat(Id) {
				uni.navigateTo({
					url: `/pages/chat/chat?userId=${Id}`,
				})
			},
			//进入创建订单页面
			createOrder(Id) {
				uni.navigateTo({
					url: `/pages/createOrder/createOrder?chefId=${Id}`,
				})
			},
			//进入厨师详情页
			goChefDetail(Id) {
				uni.navigateTo({
					url: `/pages/chefDetail/chefDetail?chefId=${Id}`,
				})
			},

			//获取行政区列表
			async getPlaceList(placeType, provinceId, cityId) {
				let result = await request("/common/GetPlaceList", {
					placeType: placeType,
					provinceId: provinceId,
					cityId: cityId,
				});
				if (result.code !== 200) {
					this.$refs.uTips.show({
						title: '数据请求异常',
						type: 'warning',
						duration: '2000'
					})
				} else if (placeType == 1) {
					let allArr = [{
						placeId: 0,
						cname: "全部"
					}];
					let arr = [...allArr, ...result.data.placeList];
					this.multiSelector[0] = arr;
				} else if (placeType == 2) {
					this.multiSelector[1] = [];
					let allArr = [{
						placeId: 0,
						cname: "全部"
					}];
					let arr = [...allArr, ...result.data.placeList];
					this.multiSelector[1] = arr;
				} else {
					this.multiSelector[2] = [];
					let allArr = [{
						placeId: 0,
						cname: "全部"
					}];
					let arr = [...allArr, ...result.data.placeList];
					this.multiSelector[2] = arr;
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100%;
		height: 100%;
	}

	.chef-list {
		width: 96%;
		margin: 0 auto;

		.list-item {
			width: 100%;
			height: 160px;
			margin-bottom: 10px;
			border-radius: 6px;
			border: 1px solid #ccc;
			display: flex;
			justify-content: space-between;

			.chef-avatar {
				height: 100%;
				width: 26%;
				display: flex;
				justify-content: center;
				align-items: center;

				.img-box {
					width: 100px;
					height: 140px;
					overflow: hidden;
					background: #fff;

					image {
						width: 100px;
						height: 140px;
					}
				}
			}

			.chef-content {
				padding: 10px 10px;
				width: 74%;
				box-sizing: border-box;

				.chef-introduce {
					width: 100%;
					height: 110px;
				}

				.control-btn {
					width: 100%;
					height: 30px;
					line-height: 30px;

					.inner-box {
						width: 80%;
						height: 100%;
						display: flex;
						justify-content: space-around;
						float: right;

						.inner-box-item {
							display: flex;
							font-size: 16px;
							height: 100%;

							.item-ico {
								width: 20px;
								height: 100%;
								display: flex;
								align-items: center;
								justify-content: center;

								image {
									width: 20px;
									height: 20px;
								}
							}

							.item-text {
								padding-left: 5px;
								font-size: 12px;
							}
						}

						.like {
							width: 30%;
						}

						.price {
							padding: 0 4px;
						}

						.chat {
							width: 16%;
						}

					}
				}

			}
		}
	}

	.slot-wrap {
		text-align: center;
		display: flex;
		width: 50%;
		margin: 0 auto;

		.select-btn {
			line-height: 36px;
		}

		.img-box {
			width: 50px;
			height: 36px;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 24px;
				height: 24px;
			}
		}
	}
</style>