<template>
	<div class="search-box">
		<div class="search-bar">
			<form action=""	class="search-bar-form" v-on:click="sousuo" onsubmit="return false">
				<label for="search-input" class="search-mask" ></label>
				<div class="search-bar-box">
					<i class="iconfont icon-sousuo"></i>
					<input id="search-input" class="search-bar-input" v-on:input="change($event)" v-model="inputVal" v-on:keyup.13="test($event)">
					<a href="javascript:void(0)" class="icon-clear" style="display:none;"></a>
				</div>
				<label for="search-input" class="search-bar-label" v-show="!search" @click="sousuo">
					<i class="iconfont icon-sousuo"></i>
					<span>搜索</span>
				</label>
			</form>
			<a href="javascript:void(0)" class="search-bar-cancel-btn" v-show="search" @click="clear">取消</a>
		</div>
	</div>
	
</template>
<script>
	export default {
		//数据源
		data() {
			return {
				search: false,
				inputVal: ''
			}
		},
		// 生命周期，跟随页面加载
		mounted: function() {

		},
		// 行为集合
		methods: {
			sousuo: function() {
				this.search = true;
			},
			clear: function() {
				this.search = false;
				this.inputVal = '';
				this.change();
			},
			change: function(e) {
				// console.log(e);
				this.$emit('searchData',this.inputVal);
			},
			test(e) {
				this.$emit('searchData',this.inputVal);
			}
		}
	}
</script>

<style lang="less" scoped rel="stylesheet/less">
	@import url("/search");
</style>