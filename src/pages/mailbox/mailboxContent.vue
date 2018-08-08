<template>
    <div>
        <header>
            <h3>{{title}}</h3>
            <p>
                <span>发件人：</span>
                <span>{{name}}</span>
            </p>

            <p>
                <span>收件人：</span>
                <span v-for="receiver in receiverList">{{receiver.name}}</span>
            </p>
            <transition name="popop">
                <div class="popop" v-show="popShow">
                    <p>
                        <span>抄送：</span>
                        <span class="contentCopy" v-for="person in contentCopy">{{person.name}}</span>
                    </p>

                    <p>
                        <span>时间：</span>
                        <span class="sendTime">{{sendTime}}</span>
                    </p>

                    <p v-for="(file,index) in fileList">
                        <span v-if="!index > 0">附件下载：</span>
                        <span v-else></span>
                        <a :href="downBasePath + '?path=' + file.path + '&fileName=' + file.name + '&token=' + token">{{file.name}}</a>
                    </p>
                </div>
            </transition>
            <p class="iconXia" @click="popShows()">
                <i :class="['icon','iconfont', popShow ? 'icon-shujushang' : 'icon-shujuxia']"></i>
            </p>
        </header>
        <section>
            {{content}}
        </section>
        <footer>
            <div>
                <router-link :to="{name: 'sendMailbox',query: {receiverList: replysingle}}">
                    <p>
                        <span class="iconSpan">
                            <i class="icon iconfont icon-pinglun"></i>
                        </span>
                    </p>
                    <span>回复</span>
                </router-link>
            </div>

            <div>
                <router-link :to="{name: 'sendMailbox',query: {receiverList: replyAll}}">
                    <p>
                        <span class="iconSpan">
                            <i class="icon iconfont icon-interactive_fill"></i>
                        </span>
                    </p>
                    <span>回复全部</span>
                </router-link>
            </div>

            <div>
                <router-link :to="{name: 'sendMailbox',query: {mailContent: content,mailTitle: title,mailFullPathDirEncoder: fullPathDirEncoder}}">
                    <p>
                        <span class="iconSpan">
                            <i class="icon iconfont icon-shuadan"></i>
                        </span>
                    </p>
                    <span>转发</span>
                </router-link>
            </div>

            <div>
                <p>
                    <span class="iconSpan">
                        <i class="icon iconfont icon-lajitong"></i>
                    </span>
                </p>
                <span>删除</span>
            </div>

        </footer>
    </div>
</template>

<script>
    import NengLong from '../../common/nenglong.cookies';

    export default {
        name: 'daiBanFaWen',
        //引用外部组件
        components: {},
        //数据源
        data() {
            return {
                popShow: false,
                //邮箱详情参数
                mailDetails: {
                    mailId: this.$cookie.getCookie('mailId'),
                    isSender: this.$cookie.getCookie('isSender')
                },
                //邮箱删除参数
                mailId: {
                    userMailId: this.$cookie.getCookie('mailId')
                },

                name: '小李',
                authorId: null,
                receiverList: ['小李，小明'],
                sendTime: '2018-03-18',
                contentCopy: [] /* 抄送人 */,
                title: null,
                content: '邮箱内容',
                fileList: null,
                downBasePath: 'http://192.168.8.225:8037/api-notice/core/downLoad' /* 下载基础路径 */,
                fullPathDirEncoder: null,
                token: this.$cookie.getCookie('token'),
                fullPathDirEncoder: ''
            };
        },
        //跟随页面加载 只执行一次
        mounted: function() {
            this.loadMailDetails();

            console.log(this.mailDetails);
            
        },
        //行为
        methods: {
            //加载收件箱详情
            loadMailDetails() {
                let that = this;
                that.$http.post('api-notice/notice/mailinternal/mailDetails', that.mailDetails, function(response) {
                    let data = response.data.datamap;
                    console.log(response);
                    that.name = data.name; /* 发件人name */
                    that.authorId = data.authorId; /* 发件人ID */
                    that.receiverList = data.receiverList; /* 收件人 */
                    that.contentCopy = data.forwarder; /* 抄送人 */
                    that.sendTime = that.timeFormat(data.sendTime);
                    that.fileList = data.fileList; /* 附件 */
                    that.title = data.title;
                    that.content = data.content;
                    that.fullPathDirEncoder = data.fullPathDirEncoder;
                    // that.message = response.data.result.list;
                    // that.isFlow = that.message.isFlow;
                    console.log(data)
                });
            },
            // 删除邮箱
            deleteMail() {
                let that = this;
                that.$http.post('api-notice/notice/mailinternal/deleteMail', that.mailId, function(response) {
                    // that.isFlow = that.message.isFlow;
                });
            },

            popShows() {
                this.popShow = !this.popShow;
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
                return this.add0(year) + '-' + this.add0(month) + '-' + this.add0(date);
            }
        },
        computed: {
            // 回复发件人,路由传参函数

            replysingle() {
                var tempArr = [];
                tempArr.push({
                    name: this.name,
                    authorId: this.authorId
                });
                return tempArr;
            },
            // 回复全部人(发件人、收件人-不包括自己、抄送),路由传参函数
            replyAll() {
                var tempArr = [];
                tempArr.push({
                    name: this.name,
                    authorId: this.authorId
                });
                this.receiverList.forEach(element => {
                    tempArr.push({
                        name: element.name,
                        authorId: element.userId
                    });
                });
                if (this.forwarder) {
                    this.forwarder.forEach(element => {
                        tempArr.push({
                            name: element.name,
                            authorId: element.userId
                        });
                    });
                }
                return tempArr;
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import url('../../style/mixin');
    @import url('/mailboxContent');
    .popop {
        max-height: 200px;
        overflow: hidden;
    }
    .popop-leave-active,
    .popop-enter-active {
        transition: all 1s ease;
    }
    .popop-leave-active,
    .popop-enter {
        max-height: 0px !important;
    }
    .popop-leave,
    .popop-enter-active {
        max-height: 200px;
    }
</style>
