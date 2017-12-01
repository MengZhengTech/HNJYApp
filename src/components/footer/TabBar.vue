<template>
    <tabbar v-model="selected">
      <tabbar-item link="/Index/Home">
        <i class="fa fa-home" slot="icon"></i>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item link="/Index/Flow">
        <i class="fa fa-file-text-o" slot="icon"></i>
        <span slot="label">审批中心</span>
      </tabbar-item>
      <tabbar-item link="/Index/Project">
        <i class="fa fa-th" slot="icon"></i>
        <span slot="label">项目</span>
      </tabbar-item>
      <tabbar-item link="/Index/Setting">
        <i class="fa fa-gear" slot="icon"></i>
        <span slot="label">设置</span>
      </tabbar-item>
    </tabbar>
</template>

<script>
  import globalData from '../../server/globalData'
  import { Tabbar, TabbarItem } from 'vux'
  export default{
      data(){
          return{
              selected:0
          }
      },
      watch:{
        '$route'(){
          this.selected = globalData.tabSelected;
        }
      },
      beforeMount(){
          this.selected = globalData.tabSelected;
      },
      components: {
          Tabbar,
          TabbarItem,
      }
  }
</script>

<style scoped>
</style>

