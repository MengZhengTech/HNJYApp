<template>
    <div>
        <HeaderBar :title="filename + fileext" :showBackBtn="true"></HeaderBar>
        <BodyContent>
            <div slot="content">
                <!-- <iframe style="margin-top:0.5rem;" src="http://img1.3lian.com/2015/a1/84/d/95.jpg" frameborder="0"></iframe> -->
                <iframe id="testIframe" style="margin-top:0.5rem;width:50rem;height:75rem;" :src="src" frameborder="0"></iframe>
            </div>
        </BodyContent>
    </div>
</template>
<script>
import HeaderBar from '@/components/header/Header'
import BodyContent from "@/components/content/BodyContent"
import apiConfig from '../../../server/apiConfig'
import globalData from '../../../server/globalData'
export default {
    data(){
        return{
            filename: null,
            fileext: null,
            // url:'%2fAccount%2fLogin_XHAPPSSO%3fReturnUrl%3d%252fPlanManage%252fAppFormShow%253ftype%253d3%2526ascxUrl%253d%25252fDesignManage%25252fIndexLockStageFlowForm%25253fprojId%25253d159%252526stage%25253d3%252526isApp%25253d1',
            url: '',
            src: null,
        }
    },
    methods:{

    },
    beforeMount(){
        this.filename = this.$route.query.filename;
        this.fileext = this.$route.query.fileext;
        this.url = this.$route.query.url;
        //this.src = 'http://des.cifi.com.cn:8035' + decodeURIComponent(this.url) + '&uid=' + globalData.user.guid;
        console.log(this.src)
    },
    mounted(){

    },
    components:{
        HeaderBar,
        BodyContent,
    }
}
</script>
