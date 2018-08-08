<template>
    <div>
        <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
            <div class="infoContent" v-for="mess in message" @click="goNoticeContent(mess.noticeId)">
                <div class="infoContent-primary">
                    <p class="font15 hei44">
                        <span class="new" v-if="!mess.readState"></span>
                        <span class="font16">{{ mess.noticeSubject }}</span>
                        <time>{{timeFormat(mess.createTime)}}</time>
                    </p>
                    <p class="mgt15 hei20" >
                        <!-- <img :src="changehtml(mess.content)" alt="loading error" > -->
                        <!-- <span v-if="!isImg">查看详情</span> -->
                        <span v-if="isText(mess.content)" v-html="extractText(mess.content)"></span>
                        <span v-else>查看详情</span>
                    </p>
                </div>
            </div>
        </vscroll>
    </div>

</template>
<script>
    import Vscroll from '../../components/refresh/refresh';
    export default {
        components: {
            Vscroll
        },
        data() {
            return {
                // 待办列表参数
                todoList: {
                    pageSize: 9,
                    pageIndex: 1,
                    keyWsord: ''
                },
                // 待办列表信息
                message: [],
                // 加载数据
                scrollData: {
                    noFlag: false //暂无更多数据显示
                },
                imgURL: 'http://192.168.8.44/',
                oIndex: 0,
                imgIs: false
            };
        },
        created() {
            this.loadTodoList();
        },
        mounted: function() {
            
        },
        //行为
        methods: {
            //加载 todoList 接口数据
            loadTodoList() {
                let that = this;
                that.$http.post('api-notice/notice/notice/list', that.todoList, function(response) {
                    console.log(response.data.result.list);
                    that.message = response.data.result.list;
                    that.isFlow = that.message.isFlow;
                });
            },
            //判断是否有纯文本
            isText(html) {
                let str = "";
                let div = document.createElement('div');
                div.innerHTML = html;
                str = div.innerText.replace(/<.*?>/gi,'');
                if (!str) {
                    return false;
                }else {
                    return true;
                }
            },
            //提取纯文本显示
            extractText(html) {
                let str = "";
                let div = document.createElement('div');
                div.innerHTML = html;
                // str = div.innerText.replace(/<\/.*?>/gi,'');
                str = div.innerText.replace(/<.*?>/gi,'');
    
                return str.slice(0,150);
            },
            // 提取图片URL
            changehtml(str) {
                // console.log(1);
                var strTemp = str.match(/src=(.)*\.(jpg|png|gif|svg)/i);
                console.log(strTemp,str)
                if (strTemp === null) {
                    
                    // console.log(this.isImg)
                    return '';
                } else {
                    str = strTemp[0]
                        .replace(/&(lt|gt|nbsp|quot);/gi, '')
                        .replace(/img|src=|amp;/gi, '');
                    this.isImg = true;
                    // console.log(this.isImg)
                    return this.imgURL + str;
                }
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

                that.todoList.pageIndex++;
                that.$http.post('api-notice/notice/notice/list', that.todoList, function(response) {
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
                let NowTime = new Date();
                let NowMonth = NowTime.getMonth() + 1;
                let NowDay = NowTime.getDate();
                if( NowMonth === month && NowDay === date) {
                    return this.add0(hours) + ':' + this.add0(minutes);
                }
                else {
                    return this.add0(month) + '-' + this.add0(date);
                }
            },

            //跳转到详情页
            goNoticeContent(noticeId) {
            	this.$cookie.setCookie('noticeId',noticeId);
                this.$router.push('noticeContent');
            }
        },
        computed: {}
    };
</script>
<style lang="less" rel="stylesheet/less" scoped>
    @import url('../../style/mixin');
    @import url('/notice');
</style>
