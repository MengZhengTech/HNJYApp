/**
* Created by Administrator on 2017/11/27.
*/
<template>
    <iframe :src="tableSrc" frameborder="0"></iframe>
</template>

<script>
    import { Popup,} from 'vux';
    export default{
        //状态值
        data(){
            return {}
        },
        props:{
            tableSrc:{
                type: String,
            }
        },
        components:{
            Popup,
        }
    }
</script>
