<template>
    <div>
        <mail-list v-if="mailListIs" @getArr="getArr"></mail-list>
        <section v-if="!mailListIs">
            <section style="background-color:#fff;margin-bottom:15px;">
                <div style="padding:15px;">
                    <input type="text" placeholder="请输入主题" style="width:100%;border-bottom:1px solid #e5e5e5;margin-bottom:5px;height:30px;line-height:30px;" v-model="writeMail.title">
                    <textarea placeholder="请输入内容" style="width:100%;" rows="10" v-model="writeMail.content"></textarea>
                </div>
            </section>

            <section>
                <div class="cell cell-access" @click="receiveUseraACtive">
                    <div class="cell-primary">
                        <p class="font15">收件人</p>
                        <span class="mail-user">{{mailUserName}}</span>
                    </div>
                    <div class="cell-ft"></div>
                </div>

                <div class="cell cell-access" @click="forwardMailActive">
                    <div class="cell-primary">
                        <p class="font15">抄送</p>
                        <span class="mail-copy">{{copyUserName}}</span>
                    </div>
                    <div class="cell-ft"></div>
                </div>

                <div class="cell cell-access up-file">
                    <div class="cell-primary">
                        <label id="file" class="font15">附件</label>
                        <input name="file" type="file" @change="update('saveFileDir',$event)" class="up-file-input" />
                        <span class="mail-file">{{upFileName}}</span>
                    </div>
                    <div class="cell-ft"></div>
                </div>
            </section>

            <section>
                <div class="fawen-footer">
                    <div class="fawen-footer-warp">
                        <div class="fawen-footer-button">
                            <a href="javascript:void(0)" @click="replyMail">完成办理</a>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
    import mailList from '../mailList/mailList';
    import axios from 'axios';
    export default {
        name: 'daiBanFaWen',
        //引用外部组件
        components: {
            mailList
        },
        //数据源
        data() {
            return {
                popShow: false,
                //回复邮箱
                writeMail: {
                    content: this.$route.query.mailContent ? this.$route.query.mailContent : '',
                    copyUserList: [],
                    isTransmit: false,
                    mailId: 0,
                    receiveUserList: [] /* 收件人id */,
                    saveFileDir: '',
                    title: this.$route.query.mailTitle ? this.$route.query.mailTitle : ''
                },
                getArr: null,
                mailListIs: false,
                sendMailToUser: this.$route.query.receiverList ? this.$route.query.receiverList : [] /* 路由传参,收件人列表对象 */,
                mailUserName: '',
                fullPathDirEncoder: this.$route.query.mailFullPathDirEncoder,
                newFileData: null,
                upFileResponse: null /* 上传附件的返回值 */,
                upFileName: '' /* 上传附件的附件列表名与转发附件列表名 */,
                saveFileDir: '' /* 两次以上，上传附件，路径地址缓存 */,
                copyMailToUser: [],
                copyUserName: ''
            };
        },
        created() {
            this.pushUserData(this.sendMailToUser);
            this.forwardMailfile();
        },
        //跟随页面加载 只执行一次
        mounted: function() {
            this.renderMailUserName(this.sendMailToUser, 'mailUserName');
            console.log(this.sendMailToUser, this);
        },
        //行为
        methods: {
            //回复邮箱
            replyMail() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                };
                var a = JSON.stringify(this.writeMail);
                console.log(a);
                if (!this.writeMail.title) {
                    alert('邮件主题不可为空');
                    return false;
                } else if (this.writeMail.receiveUserList.length === 0) {
                    alert('收件人不可为空');
                    return false;
                }
                this.$http.post('api-notice/notice/mailinternal/writeMail', a, function(response) {
                    console.log(response);
                    if (response.data.code === 1) {
                        console.log('发送成功');
                        history.back();
                    } else {
                        console.log('发送错误');
                    }
                });
            },
            popShows() {
                this.popShow = !this.popShow;
            },
            /* 首次加载时，判断，然后向收件人推入数据(authorId) */
            pushUserData(userData) {
                var _this = this;
                if (userData.length > 0) {
                    userData.forEach(element => {
                        this.writeMail.receiveUserList.push(element.authorId);
                    });
                }
            },
            /* 进入发送人列表后回调函数 */
            getReceiveUserArr(data) {
                this.mailListIs = false;
                var tempUserArr = [],
                    tempUserIdArr = [];
                if (data.arr.length > 0) {
                    data.arr.forEach(element => {
                        tempUserArr.push({
                            name: element.userName,
                            authorId: element.userId
                        });
                        tempUserIdArr.push(element.userId);
                    });
                    this.sendMailToUser = tempUserArr; /* 收件人列表对象 */
                    this.writeMail.receiveUserList = tempUserIdArr; /* 收件人列表id */
                }
            },
            getForwardMailArr(data) {
                this.mailListIs = false;
                var tempUserArr = [],
                    tempUserIdArr = [];
                if (data.arr.length > 0) {
                    data.arr.forEach(element => {
                        tempUserArr.push({
                            name: element.userName,
                            authorId: element.userId
                        });
                        tempUserIdArr.push(element.userId);
                    });
                    this.copyMailToUser = tempUserArr; /* 抄送人列表对象 */
                    this.writeMail.copyUserList = tempUserIdArr; /* 抄送人列表id */
                }
            },
            forwardMailfile() {
                var _this = this;
                if (!this.fullPathDirEncoder) {
                    return false;
                }
                this.$http.post(
                    'api-notice//notice/mailinternal/copyFile',
                    {
                        fullPathDirEncoder: this.fullPathDirEncoder
                    },
                    function(response) {
                        _this.newFileData = response.data.datamap;
                        _this.assignmentFile();
                        console.log(response);
                    }
                );
            },
            /* 转发时，数据传递、渲染 */
            assignmentFile() {
                this.writeMail.saveFileDir = this.newFileData.saveDir;
                this.renderMailUserName(this.newFileData.fileList, 'upFileName');
            },
            update(oSaveFileDir, e) {
                // 上传文件
                var self = this;
                let file = e.target.files[0];
                if (!file) {
                    console.log('用户取消了文件上传');
                    return false;
                }
                /* eslint-disable no-undef */
                let param = new FormData(); // 创建form对象
                param.append('file', file, file.name); // 通过append向form对象添加数据
                if (this.writeMail[oSaveFileDir]) {
                    param.append('saveFileDir', this.writeMail[oSaveFileDir]);
                }
                console.log(param.get('file')); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
                // 添加请求头
                self.$http.post(
                    'api-notice/notice/mailinternal/uploadMailFile',
                    param,
                    function(response) {
                        console.log(response);
                        self.writeMail[oSaveFileDir] = response.data.datamap.saveFileDir;
                        self.upFileResponse = response.data.datamap;
                        self.renderUpFile();
                    },
                    config
                );
            },
            renderUpFile() {
                if (this.upFileName) {
                    this.upFileName += ',' + this.upFileResponse.fileName;
                } else {
                    this.upFileName = this.upFileResponse.fileName;
                }
            },
            /* 渲染邮件收件人列表 */
            renderMailUserName(arr, nameStr) {
                let str = '';
                arr.forEach(element => {
                    str += element.name + '，';
                });
                str = str.slice(0, str.length - 1);
                this[nameStr] = str;
                console.log(str);
            },
            receiveUseraACtive() {
                this.getArr = this.getReceiveUserArr;
                console.log(this.getArr);
                this.mailListIs = true;
            },
            forwardMailActive() {
                this.getArr = this.getForwardMailArr;
                this.mailListIs = true;
            }
        },
        watch: {
            sendMailToUser() {
                this.renderMailUserName(this.sendMailToUser, 'mailUserName');
            },
            copyMailToUser() {
                this.renderMailUserName(this.copyMailToUser, 'copyUserName');
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import url('../../style/mixin');
    @import url('/sendMailbox');
    ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #999;
    }
    :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #999;
    }
    ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999;
    }
    :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #999;
    }
    .cell-primary {
        display: flex;
        justify-content: space-between;
        .mail-user,
        .mail-file,
        .mail-copy {
            max-width: 60vw;
            height: 1.2em;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .up-file {
        position: relative;
    }
    .up-file-input {
        position: absolute;
        top: 0;
        height: 0;
        transform: translateX(-15px);
        width: 100vw;
        height: 100%;
        opacity: 0;
    }
</style>
