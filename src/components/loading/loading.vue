<template>
	<div class="loading" v-show="loading">
		<img src="../../images/loading.gif" alt="加载中">
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: this.$store.state.loading
			}
		}
	}
</script>

<style lang="less" scoped>
	.loading {
		position: fixed;
		top:45%;
		left:45%;
		z-index:9;
	}
</style>