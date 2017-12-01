/**
* Created by Administrator on 2017/11/17.
*/
<template>
    <li class="vux-timeline-item">
        <!-- 图标 -->
        <div class="vux-timeline-item-head-first" :class="[isActive ? 'activeColor' : 'defaultColor']">
            <i class="vux-timeline-item-checked weui-icon weui_icon_success_no_circle weui-icon-success-no-circle"></i>
        </div>
        <!-- 左侧竖线 -->
        <div class="vux-timeline-item-tail" :class="[isActive ? 'activeColor' : 'defaultColor']"></div>
        <!-- 内容区 -->
        <div class="vux-timeline-item-content">
            <slot></slot>
        </div>
    </li>
</template>

<script>
    export default{
        //状态值
        data(){
            return {}
        },
        props:{
            isActive:{
                type: Boolean,
                default: false,
            },
        },
    }
</script>
<style>
  .p-timeline .vux-timeline-item-head-first {
    width: 20px;
    height: 20px;
    left: -4px;
    top: 5px;
    position: absolute;
    content: '';
    z-index: 99;
    border-radius: 99px;
  }
  .p-timeline .vux-timeline-item-checked.weui-icon-success-no-circle::before {
    font-size: 14px;
    position: absolute;
    left: 3px;
    top: 3px;
    margin: 0!important;
    color: #FFF;
  }
  .p-timeline .vux-timeline-item {
    position: relative;
  }
  .p-timeline .activeColor {
    background-color: #11e479;
  }
  .p-timeline .defaultColor{
    background-color: #cccccc;
  }
  .p-timeline .vux-timeline-item-content{
    padding: 0 0 1.5rem 1.2rem;
  }
  .p-timeline .vux-timeline-item-tail {
    position: absolute;
    content: '';
    height: 100%;
    width: 2px;
    left: 5px;
    top: 5px;
  }
</style>
