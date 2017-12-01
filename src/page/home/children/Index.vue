<template>
    <BodyContent :showBottomPadding="true">
        <div class="container" slot="content">
            <!-- 首页banner -->
            <swiper loop auto :aspect-ratio="400/800">
                <swiper-item v-for="(item,index) in homeBannerAry" :key="index">
                    <img :src="item.path" alt="#" width="100%">
                </swiper-item>
            </swiper>
            <Cell class="index-title" is-link title="新人风采" :link="{name:'Rookies',params:{name:'新人风采'}}"></Cell>
            <ul class="flexbox p-employeeShowList">
                <li
                  v-for="(item,index) in filterEmp"
                  :key="index"
                >
                    <img :src="item.path" alt="#" :onerror="defaultAvatar" width="100" style="height:100px;width: 100px;">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <Cell class="index-title" is-link title="新闻快讯" :link="{name:'News',params:{name:'新闻快讯'}}"></Cell>
            <panel :list="list" :type="type" @on-img-error="onImgError"></panel>
            <div class="index-title">
                系统设置
            </div>
        </div>
    </BodyContent>
</template>

<script>
import { Swiper,SwiperItem,Flexbox, FlexboxItem,Panel,Cell  } from 'vux'
import BodyContent from "@/components/content/BodyContent";
import apiConfig from '../../../server/apiConfig';
import axios from 'axios';
export default {
    data(){
        return {
            homeBannerAry: [], // 首页轮播图
            appNewsList: [], // 首页新闻列表
            appEmpList: [], // 首页新人展示
            loading: false, // 是否处于加载中
            defaultAvatar: 'this.src="' + require('../../../assets/images/avatar/BatMan.png') + '"',
            defaultNewsImg: 'this.src="' + require('../../../assets/images/avatar/BatMan.png') + '"',
            type: '1',
            list: [{
                src: 'http://somedomain.somdomain/x.jpg',
                fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                title: '标题一',
                desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
                url: '/component/cell'
            }, {
                src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
                title: '标题二',
                desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
                url: {
                  path: '/component/radio',
                  replace: false
                },
                meta: {
                  source: '来源信息',
                  date: '时间',
                  other: '其他信息'
                }
            }],
        }
    },
    components:{
        Swiper, SwiperItem,
        Flexbox, FlexboxItem,
        Panel, Cell,
        BodyContent,
    },
    computed: {
        filterEmp: function () {
            return this.appEmpList.filter((item,index) => {
                return index <= 2;
            });
        }
    },
    methods:{
        onImgError (item, $event) {
            // console.log(item, $event)
        },
        fetchData(){
            this.$vux.loading.show({
                text: '加载中'
            });
            this.loading = true;
            axios.get(apiConfig.companyServer+apiConfig.homeIndexData).then((response) => {
                // console.log(response);
                this.homeBannerAry = response.data.appPicList;
                this.appEmpList = response.data.appEmpList;
                this.$vux.loading.hide(); // 关闭遮罩
            }).catch(error=>{
                this.$vux.loading.hide(); // 关闭遮罩
                console.log(error);
            });
        }
    },
    beforeMount(){
        this.fetchData();
    },
}
</script>

<style>
    .carousel{
        height: 10rem;
    }
    .index-title{
        text-align: left;
        border-left: 0.2rem solid #D43C33;
        padding-left: 1rem;
        margin: 1rem 0;
    }
    .p-employeeShowList{
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: .5rem;
    }
    .p-employeeShowList li{
        width: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        flex-direction: column;
    }
    .index-newsItem{
        display: flex;
        justify-content: flex-start;
        padding: 1rem;
    }
    .index-newsItem>img{
        width: 5rem;
        height: 5rem;
    }
    .container .weui-cell {
        padding: 0px 15px;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .container .weui-cell:before{
        border-top: none;
    }
</style>

