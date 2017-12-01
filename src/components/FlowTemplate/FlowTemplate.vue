<template>
    <BodyContent>
        <div slot="content">
            <slot name="flowInfo"></slot>
            <slot name="flowAttachment"></slot>
            <slot name="flowForm"></slot>
            <slot name="flowOperation"></slot>
        </div>
    </BodyContent>
</template>
<script>
import BodyContent from "@/components/content/BodyContent"
export default {
    data(){
        return{
            
        }
    },
    components:{
        BodyContent,
    }
}
</script>
<style>
    
</style>
