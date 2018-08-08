<template>
    <div>
        <search @searchData="searchData"></search>
        <div class="fawen">
            <div class="fawen-primary">
                <p class="fawen-banli">
                    <span class="mgl15" :class="{bot3: fawen}" @click="Tab2">收件箱</span>
                    <span :class="{bot3: banli}" @click="Tab">发件箱</span>
                </p>
                <span class="mgr15" @click="goSend()">写邮件</span>
            </div>
        </div>
        <!-- 待办理 -->
        <!-- <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
            <ul>
                <li v-for="(item,index) in listdata">{{item.name}}</li>
                <li v-for="(item,index) in downdata">{{item.name}}</li>
            </ul>
        </vscroll> -->
        <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
            <div>
                <div class="infoContent" v-if="fawen" v-for="mess in message" @click="goContent(mess.mailId,mess.isSender)">
                    <div class="infoContent-primary">
                        <p class="mg5 hei30">
                            <i class="icon iconfont icon-duanxin"></i>
                            <span>{{mess.name}}</span>
                            <time>{{timeFormat(mess.sendTime)}}</time>
                        </p>
                        <p class="font15 hei40">{{mess.title}}</p>
                    </div>
                </div>
            </div>

            <div>
                <div class="infoContent" v-if="banli" v-for="mess in message2" @click="goContent(mess.mailId,mess.isSender)">
                    <div class="infoContent-primary">
                        <p class="mg5 hei30">
                            <i class="icon iconfont icon-duanxin"></i>
                            <span>{{mess.name}}</span>
                            <time>{{timeFormat(mess.sendTime)}}</time>
                        </p>
                        <p class="font15 hei40">{{mess.title}}</p>
                    </div>
                </div>
            </div>
        </vscroll>
    </div>
</template>

<script>
    import Search from '../../components/search/search';
    import Vscroll from '../../components/refresh/refresh';
    export default {
        name: 'daiBanFaWen',
        //引用外部组件
        components: {
            Search,
            Vscroll
        },
        //数据源
        data() {
            return {
                // 待办列表参数
                inMailList: {
                    pageSize: 8,
                    pageIndex: 1,
                    keyWsord: ''
                },
                outMailList: {
                    pageSize: 8,
                    pageIndex: 1,
                    keyWsord: ''
                },
                // 待办列表信息
                message: [],
                //已办列表信息
                message2: null,

                // 切换
                fawen: true,
                banli: false,
                // 加载数据
                scrollData: {
                    noFlag: false //暂无更多数据显示
                }
            };
        },
        created() {
            this.loadInMailList();
            this.loadOutMailList();
        },
        //跟随页面加载 只执行一次
        mounted: function() {
            
            // this.loadOutMailList();
        },
        //行为
        methods: {
            //加载 todoList 接口数据
            loadInMailList() {
                let that = this;
                that.$http.post('api-notice/notice/mailinternal/inMailList', that.inMailList, function(response) {
                    that.message = response.data.result.list;
                });
            },
            //加载 wasList 接口数据
            loadOutMailList() {
                let that = this;
                console.log(1);
                that.$http.post('api-notice/notice/mailinternal/outMailList', that.outMailList, function(response) {
                    console.log(response);
                    that.message2 = response.data.result.list;
                });
            },
            //上啦刷新
            onRefresh(done) {
                if (this.fawen) {
                    this.todoList.pageIndex = 1;
                    this.loadTodoList();
                } else if (this.banli) {
                    this.wasList.pageIndex = 1;
                    this.loadWasList();
                }

                done(); // call done
            },
            //下拉加载
            onInfinite(done) {
                let that = this;
                let more = this.$el.querySelector('.load-more');
                if (that.fawen) {
                    that.inMailList.pageIndex++;
                    that.$http.post('api-notice/notice/mailinternal/inMailList', that.inMailList, function(response) {
                        let data = response.data.result.list;
                        that.message = that.message.concat(data);
                        that.isFlow = that.message.isFlow;
                        more.style.display = 'none'; //隐藏加载条
                        done();
                        if (data.length < 8) {
                            more.style.display = 'none'; //隐藏加载条
                            //走完数据调用方法
                            that.scrollData.noFlag = true;
                        }
                    });
                } else if (that.banli) {
                    that.outMailList.pageIndex++;
                    that.$http.post('api-notice/notice/mailinternal/outMailList', that.outMailList, function(response) {
                        let data = response.data.result.list;
                        that.message2 = that.message2.concat(data);
                        more.style.display = 'none'; //隐藏加载条
                        done();
                        if (data.length < 8) {
                            more.style.display = 'none'; //隐藏加载条
                            //走完数据调用方法
                            that.scrollData.noFlag = true;
                        }
                    });
                }
            },
            //跳转到写邮件页面
            goSend() {
                this.$router.push({
                    path: '/sendMailbox',
                    name: 'sendMailbox'
                });
            },

            // 跳转邮箱详情页
            goContent(mailId, isSender) {
                this.$cookie.setCookie('mailId', mailId);
                this.$cookie.setCookie('isSender', isSender);
                this.$router.push({
                    path: '/mailboxContent',
                    name: 'mailboxContent'
                });
            },
            //搜索
            searchData(key) {
                this.inMailList.keyWord = key;
                this.outMailList.keyWord = key;
                this.loadInMailList();
                this.loadOutMailList();
            },
            add0(m) {
                return m < 10 ? '0' + m : m;
            },
            //时间戳转化成时间格式
            timeFormat(timestamp) {
                //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
                let time = new Date(timestamp);
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let date = time.getDate();
                let hours = time.getHours();
                let minutes = time.getMinutes();
                let seconds = time.getSeconds();
                return this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes);
            },
            //切换到办理流程，并加载办理流程数据
            Tab: function() {
                let that = this;
                this.fawen = false;
                this.banli = true;
                this.scrollData.noFlag = false;
                this.message2 ? false : this.loadOutMailList();

                // 办理流程
            },
            Tab2: function() {
                this.fawen = true;
                this.banli = false;
                this.scrollData.noFlag = false;
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import url('../../style/mixin');
    @import url('/mailbox');
</style>
