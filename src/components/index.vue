<template lang="html">
    <div class="yo-scroll" :class="{'down':(state===0),'up':(state==1),'refresh':(state===2),'touch':touching}" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <span>{{dataList}}{{offset}}{{enableInfinite}}{{enableRefresh}}</span>
        <section :style="{ transform: 'translate3d(0, ' + top + 'px, 0)' }" class="inner" >
            <header class="pull-refresh">
                <slot name="pull-refresh">
                    <span class="down-tip">下拉更新</span>
                    <span class="up-tip">松开刷新数据</span>
                    <span class="refresh-tip">加载中……</span>
                </slot>
            </header>
            <slot>
            </slot>
            <footer class="load-more">
                <slot name="load-more">
                    <span v-show="downFlag === false">上啦加载更多</span>
                    <span v-show="downFlag === true">加载中……</span>
                </slot>
            </footer>
            <div class="nullData" v-show="dataList.noFlag">暂无更多数据</div>
        </section>
    </div>
</template>

<script>
    export default {
        props: {
            offset: {
                type: Number,
                default: 100 //默认高度
            },
            enableInfinite: {
                type: Boolean,
                default: true
            },
            enableRefresh: {
                type: Boolean,
                default: true
            },
            dataList: {
                default: false,
                required: false
            },
            onRefresh: {
                type: Function,
                default: undefined,
                required: false
            },
            onInfinite: {
                type: Function,
                default: undefined,
                require: false
            }
        },
        data() {
            return {
                top: 0,
                state: 0,
                startX: 0,
                startY: 0,
                touching: false,
                infiniteLoading: false,
                downFlag: false, //用来显示是否加载中
            }
        },
        methods: {
            touchStart(e) {
                //console.log(e.targetTouches[0]);
                this.startY = e.targetTouches[0].pageY;
                this.startX = e.targetTouches[0].pageX;
                this.startScroll = this.$el.scrollTop || 0;
                this.touching = true; //留着有clientX用，不能删除
                this.dataList.noFlag = false;
                this.$el.querySelector('.load-more').style.display = 'block';
            },
            touchMove(e) {
                // if(!this.enableRefresh || this.dataList.noFlag || !this.touching) {
                //     return
                // }
    
                let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
                // console.log(diff);
                if(diff > 0) e.preventDefault();
                //向上拉 diff < 0,this.top 为 NAN,  向下拉 diff > 0, this.top为有有效值
                this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0);
                // console.log(Math.pow(diff, 0.8));
                // console.log(this.top);
                if(this.state === 2) { // in refreshing
                    return
                }
                if(this.top >= this.offset) {
                    this.state = 1
                } else {
                    this.state = 0
                }
                let more = this.$el.querySelector('.load-more');
                //this.top 为 true时是向上拉
                if(!this.top && this.state === 0) {
                    // console.log(1)
                    more.style.display = 'block';
                } else {
                    more.style.display = 'none';
                }
            },
            touchEnd(e) {
                if(!this.enableRefresh) {
                    return
                }
                //console.log(e);
                this.touching = false
                if(this.state === 2) { // in refreshing
                    this.state = 2
                    this.top = this.offset
                    return
                }
                if(this.top >= this.offset) { // do refresh
                    this.refresh()
                } else { // cancel refresh
                    this.state = 0
                    this.top = 0
                }
                //用于判断滑动是否在原地 ----begin
                let endX = e.changedTouches[0].pageX,
                    endY = e.changedTouches[0].pageY,
                    dy = this.startY - endY,
                    dx = endX - this.startX;
                //如果滑动距离太短  
                //console.log(dy +' ' + dx);
                if(Math.abs(dx) < 20 && Math.abs(dy) < 20) {
                    console.log("滑动距离太短")
                    return;
                }
                //--------end--------
                if(!this.enableInfinite || this.infiniteLoading) {
                    return
                }
                //console.log(this.$el);
                // clientHeight   元素的高
                let outerHeight = this.$el.clientHeight,
                    innerHeight = this.$el.querySelector('.inner').clientHeight,

                    scrollTop = this.$el.scrollTop,
                    ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0,

                    //bottom
                    bottom = innerHeight - outerHeight - scrollTop - ptrHeight;
                    // console.log(this.onRefresh);
                    console.log(innerHeight +' ' + outerHeight + ' ' + scrollTop + " " + ptrHeight + " " + bottom);
                // console.log(bottom + " __ " + this.offset)
                if(bottom <= this.offset && this.state === 0) {
                    this.downFlag = true;
                    this.infinite();
                } else {
                    this.$el.querySelector('.load-more').style.display = 'none';
                    this.downFlag = false;
                }
            },
            //刷新
            refresh() {
                this.state = 2;
                this.top = this.offset;
                setTimeout(() => {
                    //把函数refreshDone 当作参数传给 父组件的onReFresh函数
                    this.onRefresh(this.refreshDone)

                }, 300);
            },
            // 重新定位
            refreshDone() {
                this.state = 0
                this.top = 0
            },
            infinite() {
                this.infiniteLoading = true
                setTimeout(() => {
                    this.onInfinite(this.infiniteDone);
                }, 1000);
            },
            infiniteDone() {
                this.infiniteLoading = false
            }
        }
    }
</script>

<style lang="less" scoped>
    @import url("../style/test");
</style>