<template>
	<div>
		<!-- 部门 -->
		<div class="cell cell-access" v-for="item in department" :data-id="item.departmentId" @click="gainId(item.departmentId);goTarget()">
			<div class="cell-primary">
				<p class="font15 hei20">{{item.departmentName}}</p>
			</div>
			<div class="cell-ft"></div>
		</div>
	</div>	
</template>
<script>
	export default {
		name:'cell',
		//数据源
		data() {
			return {
			}
		},
		props:['department'],
		// 生命周期，跟随页面加载
		mounted() {
			
		},
		// 行为集合
		methods: {
		    gainId(id) {
		    	this.$store.state.departmentId = id;
		 		this.$emit('gainData',id);
		    },
		    goTarget() {
		    	this.$emit('goTarget');
		    }
		}
	}
</script>

<style lang="less" scoped rel="stylesheet/less">
	@import url("/cell");
</style>