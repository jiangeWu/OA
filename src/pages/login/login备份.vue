<template>
	<div class="login">
		<div v-for="mess in mock">
			<label :for="mess.id" v-if="mess.type !== 'select'">{{mess.name}}</label>
			<input :type="mess.type" :id="mess.id" :placeholder="mess.placeholder" v-model="mess.value" :required="mess.required" v-if="mess.type !== 'select'">
			<label :for="mess.id" v-if="mess.type === 'select'">{{mess.name}}</label>
			<select name="" id="" v-if="mess.type === 'select'">
				<option v-for="opt in mess.opt">{{opt}}</option>
			</select>
		</div>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				mock: [
					{"id":"i1","name":"输入框","type":"text","value":"","required":"","placeholder":""},
					{"id":"i2","name":"文本框","type":"tem","value":"","required":"","placeholder":""},
					{"id":"i3","name":"邮箱","type":"email","value":"","required":"","placeholder":""},
					{"id":"i4","name":"按钮","type":"button","value":"提交","required":"","placeholder":""},
					{"id":"i5","name":"复选框1","type":"checkbox","value":"","required":"","placeholder":""},
					{"id":"i6","name":"复选框2","type":"checkbox","value":"","required":"","placeholder":""},
					{"id":"i7","name":"上传文件","type":"file","value":"","required":"","placeholder":""},
					{"id":"i7","name":"下拉框","type":"select","value":"","required":"","placeholder":"","opt":[1,2,3,4]},
				]
			}
		},
		mounted: function() {
			
		},
		//行为
		methods: {
			
		}	
	}
</script>
<style lang="less" rel="stylesheet/less" scoped>
	@import url("../../style/mixin");
	@import url("/login");
</style>