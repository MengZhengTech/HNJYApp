<template>
    <BodyContent :showBottomPadding="false">
        <div class="container" slot="content">
            <div class="news-box">
                <mt-cell v-for="(item,index) in newsList" :key="index" :title="item.name" :label="item.date">
                    <img class="news-img" src="../../../assets/images/home-index/u71.png">
                </mt-cell>
            </div>
        </div>
    </BodyContent>
</template>

<script>
import BodyContent from "@/components/content/BodyContent"
import apiConfig from '../../../server/apiConfig';
import axios from 'axios';
export default {
    data(){
        return{
            newsList:[],
        }
    },
    methods:{
        getNewsData(){
            axios.get(apiConfig.companyServer+apiConfig.allNewsList)
                .then(res=>{
                    this.newsList = res.data.appNewsList;
                }).catch(err=>{
                    console.log(err)
                })
        }
    },
    beforeMount(){
        this.getNewsData();
    },
    components:{
        BodyContent,
    }
}
</script>

<style>
    .news-box .mint-cell-wrapper{
        padding-top: 1rem;
        padding-bottom: 1rem;
        background-image: none;
    }
    .news-box .news-img{
        width: 5rem;
        height: 5rem;
    }
    .news-box .mint-cell-title{
        text-align: left;
        padding-right: 0.8rem;
        line-height: 1.5rem;
    }
</style>
