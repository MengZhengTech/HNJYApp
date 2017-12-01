<template>
    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        :left-options="{showBack: showBackBtn}"
    >
        <slot name="customLeft" slot="left" v-if="customLeft">返回</slot>
      {{title}}
    </x-header>
</template>
<script>
  import { XHeader } from 'vux';
  export default {
    props:{
        showBackBtn:{
            //type: Boolean,
            default: false,
        },
        title:{
            //type: String,
            default: '标题',
        },
        customLeft:{
            default: false,
        }
    },
    data(){
        return{

        }
    },
    components:{
        XHeader
    }
}
</script>
<style scoped>
</style>
