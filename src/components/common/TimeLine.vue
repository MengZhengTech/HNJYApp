/**
* Created by Administrator on 2017/11/17.
*/
<template>
    <div class="p-timeline">
        <ul>
            <slot></slot>
        </ul>
    </div>
</template>

<script>
    export default{
        //状态值
        data(){
            return {}
        }
    }
</script>
<style>
  .p-timeline{
      padding:1rem;
      background-color: #FFF;
  }
  .p-timeline li:last-child .vux-timeline-item-tail{
      display: none;
  }
</style>
