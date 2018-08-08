<template>
	<div>
        <div class="infoContent" v-for="mess in message" @click="toTarget(mess.formId,mess.nodeId,mess.isSignIn,mess.isFlow)">
            <div class="infoContent-primary">
                <p class="font15 hei44">{{mess.title}}</p>
                <p class="mgt15 hei20"><span>{{mess.departmentName}}</span><time>{{timeFormat(mess.applyTime)}}</time></p>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
		//数据源
		data() {
			return {
				
			}
		},
		props:['message'],
		// 生命周期，跟随页面加载
		mounted() {
			
		},
		// 行为集合
		methods: {
			add0(m){
                return m<10?'0'+m:m 
            },
            //时间戳转化成时间格式
            timeFormat(timestamp){
              //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
                let time = new Date(timestamp);
                let year = time.getFullYear();
                let month = time.getMonth()+1;
                let date = time.getDate();
                let hours = time.getHours();
                let minutes = time.getMinutes();
                let seconds = time.getSeconds();
                return this.add0(month)+'-'+this.add0(date)+' '+this.add0(hours)+':'+this.add0(minutes);
            },
            toTarget(...args) {
                console.log(args[0]);
                this.$emit('goTarget',...args)
            }
		}
	}
</script>

<style lang="less" scoped rel="stylesheet/less">
	@import url("../../style/mixin");
	@import url("/officeList");
</style>