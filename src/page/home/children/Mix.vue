<template>
    <div>
        <HeaderBar :title="$route.params.name" :showBackBtn="true"></HeaderBar>
        <router-view></router-view>
    </div>
</template>

<script>
import HeaderBar from '@/components/header/Header';
import News from '@/page/home/children/News';
import Rookies from '@/page/home/children/Rookies';
export default {
    data(){
        return {

        }
    },
    beforeMount(){
        // console.log(this.$route)
    },
    components:{
        HeaderBar, News, Rookies,
    }
}
</script>

<style>

</style>
