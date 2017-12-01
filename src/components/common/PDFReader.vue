/**
* Created by Administrator on 2017/11/24.
*/
<template>
  <iframe src="//cdn.mozilla.net/pdfjs/tracemonkey.pdf"
          width="100%" height="100%" frameborder="0" scrolling="no" style="overflow: auto"></iframe>
</template>

<script>
  export default {
      data(){
          return {
              pdfurls:'//cdn.mozilla.net/pdfjs/tracemonkey.pdf',
              isshowpdf:true
          }
      },
  }
</script>
