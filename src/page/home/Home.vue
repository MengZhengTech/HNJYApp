<template>
    <div>
        <HeaderBar title="首页"></HeaderBar>
        <Index></Index>
    </div>
</template>

<script>
import globalData from '../../server/globalData';
import HeaderBar from '@/components/header/Header';
import Index from '@/page/home/children/Index';
import News from '@/page/home/children/News';
import Rookies from '@/page/home/children/Rookies';
export default {
    data(){
        return {
            tabSelected:0
        }
    },
    beforeMount(){
        globalData.tabSelected = this.tabSelected;
    },
    components:{
        HeaderBar, Index, News, Rookies,
    }
}
</script>

<style>

</style>
