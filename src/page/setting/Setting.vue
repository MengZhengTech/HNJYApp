<template>
    <div>
        <HeaderBar title="设置"></HeaderBar>
        <BodyContent :showBottomPadding="false">
            <div slot="content">
                <div class="setting-info">
                    <img src="../../assets/images/logo/ico120.png" class="setting-logo">
                    <div class="setting-system-name">旭辉设计系统</div>
                </div>
                <div class="setting-operation">
                    <x-button class="setting-button" type="warn">清除缓存</x-button>
                    <x-button class="setting-button" type="warn">修改密码</x-button>
                    <x-button class="setting-button" type="warn">退出当前账号</x-button>
                </div>
            </div>
        </BodyContent>
    </div>
</template>

<script>
import HeaderBar from '@/components/header/Header';
import BodyContent from "@/components/content/BodyContent";
import globalData from '../../server/globalData';
import { XButton } from 'vux'

export default {
    data(){
        return {
            tabSelected:3
        }
    },
    beforeMount(){
        globalData.tabSelected = this.tabSelected;
    },
    components:{
        HeaderBar, XButton, BodyContent,
    }
}
</script>

<style>
    .setting-info{
        padding: 3rem 0;
        background-color: #fff;
        border-bottom: 1px solid #d9d9d9;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .setting-info .setting-logo{
        width: 5rem;
        height: 5rem;
    }
    .setting-info .setting-system-name{
        margin-top: 0.5rem;
        letter-spacing: 0.2rem;
        font-weight: bold;
    }
    .setting-operation{
        padding-top: 1.5rem;
    }
    .setting-operation .setting-button{
        width: 70%;
    }
</style>
