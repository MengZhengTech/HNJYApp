/**
* Created by Administrator on 2017/11/13.
*/
<template>
    <div class="fullScreen">
        <router-view></router-view>
        <!--<TabBar></TabBar>-->
    </div>
</template>

<script>
    import TabBar from '../components/footer/TabBar.vue';
    export default{
        //状态值
        data(){
            return {
                // showTabbar:true
                // tabSelected:0
            }
        },
        watch: {
            '$route': function(val, oldVal){
                // console.log(val)
                // /^\/Home|Flow|Project|Setting/.test(val.path) ? this.showTabbar = true : this.showTabbar = false;
                // if(val.name == 'Home' || val.name == 'Flow' || val.name == 'Project' || val.name == 'Setting'){
                //     this.showTabbar = true;
                // }
                // else{
                //     this.showTabbar = false;
                // }
                // console.log(val.name)
            }
        },
        beforeMount(){
            // switch(this.$route.name){
            //         case 'Home':
            //             this.tabSelected = 0;
            //             break;
            //         case 'Flow':
            //             this.tabSelected = 1;
            //             break;
            //         case 'Project':
            //             this.tabSelected = 2;
            //             break;
            //         case 'Setting':
            //             this.tabSelected = 3;
            //             break;
            //     }
        },
        components:{
            TabBar,
        }
    }
</script>
