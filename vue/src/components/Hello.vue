<!-- //  v-if="isShowLoading" -->
<template>
  <div class="">
    <div class="personalCenter">
        <div class="allHeader">
            <p >超人圈</p>
            <div class="rightHeader">
                <img src="../images/ic_menu_public_forum.png" alt="">
            </div>
        </div>
        <div v-if="isShowLoading"
        class="loading clearfix">
          <div class="clearfix"
        style="margin:0 auto;width:2.8rem;">
            <img src="../images/loading_more.gif"  class="loadingimg fl">
            <div class="fl loadingText">
                手松开刷新
            </div>
          </div>
        </div>
    <div class="aui-refresh-content"
        v-on:touchstart="touchstart"
        v-on:touchmove="touchmove"
        v-on:touchend="touchend"
        v-bind:style="{top:pageMoveY+'px'}"
        v-scroll="onScroll"
        >
      <div class="aui-content"
          >
        <div class="gerenNav clearfix">
            <div class="fl gerenNavActive" >
                广场
            </div>
            <div class="fl" >
              朋友圈
            </div>
        </div>
              <div class="friendGroup_content" >
                  <ul class="clearfix" id="friendGroup_content">
                      <li v-for="(item,index) in list">
                        <div class="touxiang_logo fl">
                              <img v-bind:src="'http://cloud.siui.com/'+item.vForum.Avatar" alt="">
                        </div>
                        <div class="fgContent fl">
                              <div class="friendGroup_name">
                                    {{item.vForum.Nickname}}
                              </div>
                              <div class="friendGroup_info">
                                    {{item.vForum.CustomTitle}}
                              </div>
                              <div class="huanzhe_info">
                                    {{item.vForum.CustomDescription}}
                              </div>
                              <div class="imgvideo clearfix">
                                  <section v-for="url in item.forumFilesURL">
                                    <img :src="url" alt="">
                                  </section>
                              </div>
                              <div class="friendGroup_bottom clearfix">
                                  <div class="fl friendGroup_time">
                                      {{item.vForum.CreateTime}}
                                  </div>
                                  <div class="fr friendGroup_userControl ">
                                      <div class="fl deleteFG ">
                                                删除
                                      </div>
                                      <div class="fl">
                                        <!-- aixinLogo fl -->
                                          <div v-bind:class="[item.liked ? 'aixinLogoActive'  : 'aixinLogo','fl']">

                                          </div>
                                          <div class="aixinText fl">
                                            {{item.likerCount}}
                                          </div>
                                      </div>
                                      <div class="fl" style="margin-left:.2rem;">
                                        <div class="dianzanLogo fl">

                                        </div>
                                        <div class="dianzanText fl">
                                            {{item.commentCount}}
                                        </div>
                                      </div>
                                  </div>
                              </div>
                        </div>
                      </li>
                  </ul>
              </div>
              <div
              v-if="showMoreLoading"
              class="scrollLoading">
                <div class="clearfix" style="margin:0 auto;width:2.8rem;">
                  <img src="../images/loading_more.gif"  class="loadingimg fl">
                  <div class="fl loadingText">
                      滑动加载数据
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  </div>

</template>

<script>
import util from "../util.js";
export default {
  name: 'hello',
  data () {
    return {
      pageY:0,
      pageMoveY:0,
      height:0,
      list:[],
      hasRefresh:true,
      isShowLoading:false,
      show:{
        display:'block'
      },
      hide:{
        display:'none'
      },
      totalheight:0,
      pageNo:1,
      isMore:true,
      showMoreLoading:false
    }
  },
  created:function () {
    this.ajaxType()
    this.height=document.documentElement.clientWidth/7.5*0.8
    this.pageMoveY=document.documentElement.clientWidth/7.5*0.8
  },
  methods: {
    ajaxType:function () {
      util.ajax("http://cloud.siui.com:8070/api/Forum",{"pageNumber":1,"pageSize":5,"sortName":"ForumID","sortOrder":"desc","where":null},"get")
      .then((data)=>{
        this.list=data.Rows;
      })
    },
    touchstart:function(event){
      var targetTouches = event.targetTouches[0];
      this.pageY=targetTouches.pageY;
    },
    touchmove:function(event){
      var targetTouches = event.targetTouches[0];
      var srollPos = $(window).scrollTop();   //滚动条距顶部距离(页面超出窗口的高度)
        // console.log(srollPos);
         this.totalheight= parseFloat($(window).height()) + parseFloat(srollPos);

      var range=50;
      //下啦刷新的情况
      if(targetTouches.pageY-this.pageY>0){
        this.pageMoveY=targetTouches.pageY-this.pageY+this.height;
      }else{
        //滑动加载
        //开关isMore

        if(($(document).height()-range) <= this.totalheight &&this.isMore ) {
          this.isMore=false;
          this.showMoreLoading=true;
          this.pageNo=this.pageNo+1;
          util.ajax("http://cloud.siui.com:8070/api/Forum",{"pageNumber":this.pageNo,"pageSize":5,"sortName":"ForumID","sortOrder":"desc","where":null},"get")
          .then((data)=>{
            //数组拼数组
            this.list=this.list.concat(data.Rows);
            //打开开关
            this.isMore=true;
            this.showMoreLoading=false;
          })
        }
      }
      if(this.pageMoveY>100&&this.hasRefresh){
        this.hasRefresh=false;
        this.isShowLoading=true;
        util.ajax("http://cloud.siui.com:8070/api/Forum",{"pageNumber":1,"pageSize":5,"sortName":"ForumID","sortOrder":"desc","where":null},"get")
        .then((data)=>{
          this.list=data.Rows;
        })
      }
    },
    touchend:function(event){
      // var this=this;
      //下啦刷新判断
      if(this.pageMoveY>this.height){
        var timer =  setInterval(function(){
            this.pageMoveY-=10;
            this.isShowLoading=false;
            console.log(this.pageMoveY);
            if(this.pageMoveY<=document.documentElement.clientWidth/7.5*0.8){
              this.hasRefresh=true;
              this.pageMoveY=document.documentElement.clientWidth/7.5*0.8
              clearInterval(timer);
            }
          }.bind(this),10)
      }
    },
    onScroll:function(event){
      console.log($(window).scroll());
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
