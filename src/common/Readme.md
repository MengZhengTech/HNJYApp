#### 解决mint-ui中下拉和上拉触发点击事件的问题
将mint-ui.common.js  覆盖到 node_modules/mint-ui/lib 文件夹下即可。  
> PS：实际解决方案如下
> 
> 按需引入，去项目中找到loadmore下的index.js，全部引入的要找mint下面mint-ui.common.js
> 
> 路径如下：你的项目名/node_modules\mint-ui\lib\loadmore\index.js
> 
> 搜索 handleTouchEnd ，记得写event进去
> 
> handleTouchEnd: function handleTouchEnd(event) {...}
>  
> 然后在down和up两个事件中加入默认阻止和取消冒泡
> 
> 
> ```
> if (this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.translate > 0) {
> event.preventDefault();
> event.stopPropagation();
> ...
> if (this.direction === 'up' && this.bottomReached && this.translate < 0) {
> event.preventDefault();
> event.stopPropagation();
> ...
> ```
