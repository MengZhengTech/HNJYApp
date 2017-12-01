<template>
    <BodyContent :showBottomPadding="false">
        <div class="container" slot="content">
            <div class="rookies-box" v-for="(item,index) in brideList" :key="index">
                <img class="rookies-img" src="../../../assets/images/home-index/u71.png" >
                <div class="rookies-info">
                    <span class="rookies-name">{{item.name}}</span>
                    <p class="rookies-data">入职日期：{{item.entryDate}}</p>
                    <p class="rookies-position">郑州事业部设计部副经理</p>
                </div>
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
            brideList:[],
        }
    },
    methods:{
        getBrideData(){
            axios.get(apiConfig.companyServer+apiConfig.brideList)
                .then(res=>{
                    this.brideList = res.data.appEmpList;
                }).catch(err=>{
                    console.log(err)
                })
        }
    },
    beforeMount(){
        this.getBrideData();
    },
    components:{
        BodyContent,
    }
}
</script>

<style>
    .rookies-box{
        width: 100%;
        background-color: #fff;
        display: flex;
        padding: 1rem 0 1rem 0.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 5px 5px gray;
    }
    .rookies-img{
        width: 5rem;
        height: 5rem;
    }
    .rookies-info{
        text-align: left;
        padding-left: 0.8rem;
    }
    .rookies-name{
        vertical-align: middle;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    .rookies-data{
        font-size: 0.6rem;
        color: gray;
        padding-top: 0.5rem;
    }
    .rookies-position{
        font-size: 0.8rem;
        color: gray;
        padding-top: 0.5rem;
    }
</style>
