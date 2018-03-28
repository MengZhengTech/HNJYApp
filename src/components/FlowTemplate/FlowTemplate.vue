<template>
    <BodyContent :showTopPadding="false" :showBottomPadding="noBottom">
        <div slot="content">
            <slot name="flowInfo"></slot>
            <slot name="flowAttachment"></slot>
            <slot name="flowForm"></slot>
            <slot name="flowOpinion"></slot>
            <slot name="flowOperation"></slot>
        </div>
    </BodyContent>
</template>
<script>
import BodyContent from "@/components/content/BodyContent"
export default {
    props:{
        noBottom:{
            default: true,
        },
    },
    data(){
        return{
            showBottom:true,
        }
    },
    components:{
        BodyContent,
    }
}
</script>
<style>
    
</style>
