<template>
	<div>
		<mail-list v-if="ifMail" @getArr="getArr" :getName="getName"></mail-list>
		<loading v-show="loading"></loading>
		<div v-if="!messShow && !ifMail" v-show="!loading">
			<div class="fawen">
				<div class="fawen-primary">
					<p class="fawen-banli" @click="Tab2"><span :class="{bot3: fawen}">发文办理</span></p>
					<p class="fawen-guocheng" @click="Tab"><span :class="{bot3: banli}">办理过程</span></p>
				</div>
			</div>
			<!-- 办理过程 -->
			<div class="fawen-wrap" v-show="fawen">
				<div class="fawen-title">
					<div class="fawen-title-primary">
						<p class="font15 hei44">{{bastInfo.title}}</p>
						<p class="font13 hei20">发文单位: {{bastInfo.departmentName}}</p>
						<p class="font13 hei20">文件号: {{bastInfo.docNo}}</p>
					</div>
				</div>
				<div>
					<div class="fawen-content" >
						<div class="fawen-content-primary">
							<p class="font15 docViewName">
								<span>正文内容</span>
								<!-- <a class="fr" @click="downDocViewName(bastInfo.docViewName)">{{bastInfo.docViewName}}</a> -->
								<a class="fr" :href="'http://13512799741.imwork.net:23605/api-office/office/sendfile/downLoadDocFile?formId='+formId+'&token='+token">{{bastInfo.docViewName}}</a>
							</p>
						</div>
						<div class="fawen-content-ft"></div>
					</div>

					<div class="fawen-content" v-for="(file,index) in fileList">
						<div class="fawen-content-primary">
							<p class="font15 oldFileName">
								<span v-show="!index > 0">附件下载</span>
								<!-- <a class="fr" @click="downFile(file.attachmentId,file.oldFileName)">{{file.oldFileName}}</a> -->
								<a class="fr" :href="'http://13512799741.imwork.net:23605/api-office/office/sendfile/downLoadFile?fileId='+file.attachmentId+'&formId='+formId+'&token='+token">{{file.oldFileName}}</a>
							</p>

						</div>
						<div class="fawen-content-ft"></div>
					</div>

					<div class="fawen-content" @click="shouJianRen('审批意见')">
						<div class="fawen-content-primary">
							<p class="font15"><span>审批意见</span><a class="fr">{{mess}}</a></p>
						</div>
						<div class="fawen-content-ft"></div>
					</div>

					<div class="fawen-content" @click="getBanLiYiJian()">
						<div class="fawen-content-primary">
							<p class="font15"><span>办理意见</span><a class="fr"></a></p>
						</div>
						<div class="fawen-content-ft"></div>
					</div>

					<div v-if="!isSignIn">

						<div class="fawen-content" @click="shouJianRen('执行动作')" v-if="ifZhiXingDongZuo">
							<div class="fawen-content-primary">
								<p class="font15"><span>执行动作</span><a class="fr">{{zhiXingDongZuoShow}}</a></p>
							</div>
							<div class="fawen-content-ft"></div>
						</div>

						<div class="fawen-content" @click="getNextNodeBanLiRen()" v-if="ifZhiXingDongZuo">
							<div class="fawen-content-primary">
								<p class="font15">
									<span>下一环节办理人</span>
									<a class="fr" v-if="userName1 === []">选择成员</a>
									<a class="fr" v-else="userName1">{{userName1}}</a>
								</p>
							</div>
							<div class="fawen-content-ft"></div>
						</div>
	
						

						<div class="fawen-content" @click="shouJianRen('短信提醒')" v-if="ifDuanXin" v-show="ifZhiXingDongZuo">
							<div class="fawen-content-primary">
								<p class="font15"><span>短信提醒</span><a class="fr">{{duanXinShow}}</a></p>
							</div>
							<div class="fawen-content-ft"></div>
						</div>
					</div>	

				</div>
				
				<div class="fawen-footer">
					<div class="fawen-footer-warp">
						<div class="fawen-footer-button">
							<a href="javascript:void(0)" v-if="!isSignIn" @click="wanChengBanLi()">完成办理</a>
							<a href="javascript:void(0)" v-if="isSignIn" @click="qianShou()">签收</a>
						</div>

					</div>
				</div>
			</div>	

			<!-- 办理流程 start-->
			<div class="banli-wrap" v-show="banli">
				<div class="fawen-title" v-for="(mess,index) in liucheng">
					<div class="fawen-title-primary">
						<p class="hei44">
							<span class="font15 wt210">{{index + 1 + '.'}} {{mess.nodeName}}</span>
							<time class="time2">{{timeFormat(mess.executeTime)}}</time>
						</p>
						<p class="font13 hei20">
							<span>{{mess.userName}}</span>
							<span class="fr" v-if="mess.executeFlag">{{mess.content}}</span>
							<span class="jinxingzhong" v-else>进行中</span>
						</p>
					</div>
				</div>
			</div>
			<!-- 办理流程 ned -->

			
			
			<!-- 弹窗内容 start-->
			<transition name="popop">	
				<div class="popop" v-show="popShow"> 
					<!-- 审批意见 -->
					<div class="bor1" v-if="isPanDuan === '审批意见'" v-for="item in shenPiYiJian" @click="getShenPiYiJian(item)">
						<p>{{item}}</p>
					</div>

					<!-- 执行动作 -->
					<div class="bor1" v-if="isPanDuan === '执行动作'" v-for="item in zhiXingDongZuo" @click="getZhiXingDongZuo(item)">
						<p>{{item.describe}}</p>
					</div>

					<!-- 短信 -->
					<div class="bor1" v-if="isPanDuan === '短信提醒'" v-for="item in duanXinTiXing" @click="getDuanXinTiXing(item)">
						<p>{{item.name}}</p>
					</div>

					<!-- 退回 -->
					<div class="bor1" v-if="isPanDuan === '退回'" v-for="item in tuiHui" @click="isHuiTui(item)">
						<p>{{item.nodeName}}[{{item.finalExecuteUserName}}]66</p>
					</div>
					
					<div class="mgt10" @click="shouJianRen">
						<p>取消</p>
					</div>
				</div>
			</transition>
			<!-- 弹窗内容 end -->
 
 			<!-- 遮罩层 start-->
			<transition name="mask">	
				<div id="mask" v-show="popShow" @click="shouJianRen">
					
				</div>
			</transition>
			<!-- 遮罩层 end -->
		</div>
		<!-- 办理意见 start -->
		<div class="banLiYiJian" v-if="messShow">
			<div class="banLiYiJian-content">
				<textarea name="neirong" rows="10" autofocus="autofocus" placeholder="请输入办理意见"	 v-model="mess"></textarea>
			</div>
			<div class="banLiYiJian-complete">
				<div>
					<a href="javascript:void(0)" @click="getBanLiYiJian()">完成</a>
				</div>
				
			</div>
		</div>
		<!-- 办理意见 end -->
	</div>
</template>

<script>
	import mailList from '../mailList/mailList'
	import loading from '../../components/loading/loading'
	export default {
		
		name: 'faWenXiangQing',
		//引用外部组件
		components: {
			mailList,
			loading
		},
		//数据源
		data() {
			return {
				token: this.$cookie.getCookie('token'),
				ifMail: false,
				getName: '',
				// userName1 存放下一环节办理人选中的成员
				userName1:'',


				formId: this.$cookie.getCookie('formId'),
				// 结束与作废环节短信提醒不显示
				ifDuanXin: true,

				//判断执行动作存在否
				ifZhiXingDongZuo: true,
				
				// 是否签收
				isSignIn: this.$cookie.getCookie('isSignIn') == 1 ? true : false,
				
				// 发文办理接口 参数  使用cookie   防止页面刷新失效
				todoInfo: {
				  	'formId': this.$cookie.getCookie('formId'),
				  	'nodeId': this.$cookie.getCookie('nodeId'),
				  	'isSignIn': this.$cookie.getCookie('isSignIn') == 1 ? true : false
				},
				// 办理流程接口参数
				handleProcessInfoList: {
					'formId': this.$cookie.getCookie('formId')
				},
				// 完成办理接口参数
				nextStep : {
	      			'content': '',
	      			'formId' : this.$cookie.getCookie('formId') + '',
	      			'msg': false,
	      			'nextNodeExecuteUserIdList': [],
	      			'nextNodeItemId':'',
	      			'nowNodeId': this.$cookie.getCookie('nodeId') + '',
	      		},
	      		// 退回环节接口参数
				canBackNodeList: {
					'nodeId': this.$cookie.getCookie('nodeId') + '',
					'formId': this.$cookie.getCookie('formId') + ''
				},
				//判断弹窗
				popShow: false,		
				//审批意见
				shenPiYiJian:['同意','不同意'],
				// 办理意见内容
				mess: '同意',
				//办理意见显示
				messShow: false,

				// 短信提醒
				duanXinTiXing: [{'name':'发送'},{'name':'不发送'}],
				// 短信提醒显示
				duanXinShow:'不发送',
				// 是否发送短信 发送为true,不发送为false
				msg: false,

				// 下一环节
				nextNodeItemList: [],

				// 执行动作
				zhiXingDongZuo: [],
				//执行动作显示
				zhiXingDongZuoShow:'',


				// 退回环节
				tuiHui: [],
			
				// 判断是哪个弹窗内容
				isPanDuan: '',
				// 协议
				bastInfo:'',
				//附件下载
				fileList:[],
				// 是否可退回
				isBack: false,
				// 是否可多人办理
				isMultiHandle: true,
				// 为true时开启其他办理人
				isOther: false,
				
				//true 时是自定义流程 false时是预设流程 
				hasFlow: true,
								
				// 流程
				liucheng: [],
				// 切换
				fawen: true,
				banli: false,
				loading: false

			}
		},
		created() {
			this.loadTodoInfo();
			this.loadHandleProcessInfoList();
		},
		//跟随页面加载 只执行一次
		mounted: function() {
			
		},
		//行为
		methods: {
			//加载 todoInfo 接口数据
			loadTodoInfo() {
				let that = this;
				that.loading = true;
				that.$http.post('api-office/office/sendfile/todoInfo',that.todoInfo,function(response) {
					that.loading = false;
					console.log(response);
					if (response.status === 200) {
						let data = response.data.datamap
						that.bastInfo = data.bastInfo;
						that.fileList = data.fileList;

						that.isMultiHandle = data.isMultiHandle;

						if(!that.isSignIn) {
							that.loadSandlingOpinions();
							that.isBack = data.isBack;
							that.hasFlow = data.hasFlow;
							// hasFlow 为true时是自定义流程   为false时是预设流程
							that.isOther = false;
							//显示执行动作，预设流程
							for (let j in data.nextNodeItemList) {
								that.zhiXingDongZuo.push(data.nextNodeItemList[j]);
							}
							that.zhiXingDongZuo.length = data.nextNodeItemList.length;
							that.zhiXingDongZuoShow = that.zhiXingDongZuo[0].describe;
							that.nextStep.nextNodeItemId = that.zhiXingDongZuo[0].code;
							
						}else {
							that.loadSignInOpinions();
						}	
					
					}	
				});
			},
			//加载 handleProcessInfoList 接口数据
			loadHandleProcessInfoList() {
				let that = this;
				that.$http.post('api-office/office/sendfile/handleProcessInfoList',that.handleProcessInfoList,function(response) {
					if(response.status === 200) {
					 	if(response.data.code === 1) {
						 	that.liucheng = response.data.list;
					 	}
					}
				})
			},
			//加载办理意见
			loadSandlingOpinions() {
				let that = this;
				that.$http.post('api-office/office/sendfile/sandlingOpinions',{},function(response) {
					if(response.status === 200) {
					 	if(response.data.code === 1) {
						 	that.shenPiYiJian = response.data.result;
					 	}
					}
				})
			},
			//加载签收意见
			loadSignInOpinions() {
				let that = this;
				that.$http.post('api-office/office/sendfile/signInOpinions',{},function(response) {
					if(response.status === 200) {
					 	if(response.data.code === 1) {
						 	that.shenPiYiJian = response.data.result;
					 	}
					}
				})
			},
			// 弹出框
			// 审批意见
			getShenPiYiJian(str) {
				this.mess = str;
				this.mess = str;
		    	this.popShow = !this.popShow;
			},
			// 短信提醒
			getDuanXinTiXing(str) {
				str.name === '发送' ? this.msg = true : this.msg = false;
				this.duanXinShow = str.name;
		    	this.popShow = !this.popShow;
			},
			
	      	// 执行动作
	      	getZhiXingDongZuo(str) {
	      		if(str.describe === '归档' || str.describe === '作废') {
	      			this.ifDuanXin = false;
	      		}else if(str.describe === '退回'){
	      			this.isPanDuan = '退回'
	      			this.getTuiHui();
	      			this.popShow = false;
	      		}else {
	      			this.ifDuanXin = true;
	      		}
	      		this.nextStep.nextNodeItemId = str.code;
	      		this.zhiXingDongZuoShow = str.describe;
	      		this.popShow = !this.popShow;
	      	},
	      	// 下一环节办理人
	      	getNextNodeBanLiRen(str) {
	      		this.ifMail = true;
	      	},
	      	//下一环节办理人数据获取
	      	getArr(data) {
	      		this.ifMail = false;
	      		this.userName1 = [];
	      		for(let i=0, len = data.arr.length; i < len; i++) {
					this.nextStep.nextNodeExecuteUserIdList.push(data.arr[i].userId);
					this.userName1.push(data.arr[i].userName);
				}
				this.userName1 = this.userName1.join(',');
	      	},
	      	shouJianRen(str) {
	      		this.isPanDuan = str;
	      		this.popShow = !this.popShow;
	      	},
		    // 下一环节弹出框数据处理
		    // 弹出框选项
		    showItem: function(item) {
		    	this.popShow = !this.popShow;
		    	
		    },
			//切换到办理流程，并加载办理流程数据
			Tab: function() {
				let that = this;
				this.fawen = false;
				this.banli = true;
				
			},
			Tab2: function() {
				this.fawen = true;
				this.banli = false;
			},

	      	
			// 退回流程获取
	      	getTuiHui() {
	      		let that = this;
				// 获取发文列表
				this.$http.post('api-office/office/sendfile/canBackNodeList',this.canBackNodeList,function(response) {
					if (response.status === 200) {
						console.log(response);
						let data = response.data;
						for (let i in data.list) {
							that.tuiHui.push(data.list[i]);
						}
						that.tuiHui.length = data.list.length;
						console.log(that.tuiHui);
					}
				});

	      	},
	      	// 预设流程回退
	      	isHuiTui(item) {
	      		console.log('预设');
	      		console.log(item);
	      		let that = this;
	      		let backDef = {
	      			'backNodeId' : item.nodeId,
	      			'formId' : this.$cookie.getCookie('formId'),
	      			'msg': that.msg,
	      			'nowNodeId':this.$cookie.getCookie('nodeId'),
	      			'userId':item.executeUserId
	      		}

				// 获取发文列表
				this.$http.post('api-office/office/sendfile/backDef',backDef,function(response) {
					console.log(response);
					if (response.status === 200) {
						if(response.data.code === 1) {
							alert('操作成功！');
							that.$router.push('daibanfawen');
						}
					}
				});
	      	},
	      	
	      	//签收
	      	qianShou() {
				let that = this;
				let signIn = {
					"content": that.mess,
					"formId": this.$cookie.getCookie('formId')
				}
				this.$http.post('api-office/office/sendfile/signIn',signIn,function(response) {
					console.log(response);
					if (response.status === 200) {
						alert('操作成功！');
						that.$router.push('daibanfawen');
						
					}
				});
	      	},
	      	// 完成办理
	      	wanChengBanLi() {
	      		let that = this;
	      		that.nextStep.msg = that.msg;
	      		that.nextStep.content = that.mess;
	      		console.log(that.nextStep);
	      		
	      		this.$http.post('api-office/office/sendfile/nextStep',that.nextStep,function(response) {
					console.log(response);
					if (response.status === 200) {
						alert('操作成功！');
						that.$router.push('daibanfawen');
						
					}
				});
	      	},
	      	// 办理意见
	      	getBanLiYiJian() {
	      		this.messShow = !this.messShow;
	      	},
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
			    return year+'-'+this.add0(month)+'-'+this.add0(date)+' '+this.add0(hours)+':'+this.add0(minutes)+':'+this.add0(seconds);
			},
	      	text() {
	      		console.log(6666);
	      	}
	      	// 自定义流程退回
	   //    	getback() {
	   //    		let that = this;
				// // 获取发文列表
				// this.$http.post('sendfile/back',this.docViewName,function(response) {
				// 	if (response.status === 200) {
				// 	}
				// },{'baseURL':'http://192.168.8.225:8042/api-office/office'});
	   //    	}
	      	
		},

	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import url("../../style/mixin");
@import url("/faWenXiangQing");



</style>