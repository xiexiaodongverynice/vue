<template>
<el-container>
      <el-header>
        <!-- 头部 -->
        <keep-alive>
          <cms-header></cms-header>
          </keep-alive>
      </el-header>
      <el-container>
        <keep-alive>
          <el-aside :width="$store.state.sys.asideWidth">
            <!-- 左侧部 -->
            <cms-submenu></cms-submenu>
          </el-aside>
        </keep-alive>
        <el-main > 
          <!-- 内容 -->
          <ul>
            <ul class="breadcrumb">
                    <li>
                        <span class="iconfont icon-home"></span>
                    </li>
                    <li v-for="(item,index) in $route.matched" :key="item.path" v-if="item.name!=undefined">
                        <router-link :to="item.path" v-if="index!=$route.matched.length-1&&!item.meta.isLink">{{item.name}}</router-link>
                          <a href="javascript:void(0)" v-else>{{item.name}}</a>
                    </li>   
                </ul>
          </ul>
           <app-main class="firstContainer"></app-main>
          </el-main>
      </el-container>
      <div class="right-sider" :class="[$store.state.sys.pwdCollapse?'active':'']">
            <el-form :model="userInfo" :rules="rules" ref="userInfo">
                <el-form-item label="" class="form-group label-no-margin" prop="origPwd">
                    <el-col >
                        <el-input placeholder="原密码" v-model="userInfo.origPwd" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="" class="form-group label-no-margin" prop="newPwd">
                    <el-col >
                        <el-input placeholder="新密码" v-model="userInfo.newPwd"  type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="" class="form-group label-no-margin" prop="newPwd2" style="border:none">
                    <el-col >
                        <el-input placeholder="重复新密码" v-model="userInfo.newPwd2" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <div class="clearfix">
                     <el-button type="primary"  @click="changePwd" style="float:left;width:47%">修改密码</el-button>
                      <el-button type="info"  style="float:right;width:47%;background:#999;border-color:#999">取消</el-button>
                </div>
               
                
            </el-form>
        </div>
</el-container>
     
</template>

<script>

import cmsHeader from "@/components/header.vue";
import cmsSubmenu from "@/components/subMenu.vue";
import cmsTop from "@/components/top.vue";
import axios from "axios"
export default {
  components: {cmsHeader, cmsSubmenu,cmsTop},
  data() {
    var valOld=(rule, value, callback)=>{
       if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        axios.post('/api/member/personal/check_pwd',{origPwd:value}).then(res=>{
              if(res.body.pass==true){
                callback();
              }else{
                callback(new Error("原密码输入不正确"));
              }
        })
      }     
    };

     var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userInfo.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        origPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      rules: {
        origPwd:[{
           validator: valOld,
            trigger: "blur"
        }  
        ],
        newPwd: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        newPwd2: [
          {
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods:{
     queryChange(){
        let clientWidth=document.body.clientWidth;
        let clientHeight=document.body.clientHeight;
          $('.firstContainer').css('minHeight',(clientHeight-110)+'px');
            $('.secondContainer').css('minHeight',(clientHeight-110)+'px');
         if(clientWidth<1200){
           this.$store.dispatch('setCollapse',true);
         }else{
            this.$store.dispatch('setCollapse',false);
         }
     }, 
    changePwd(){
        this.$refs["userInfo"].validate(valid => {
        if (valid) {
        
        axios.post('/api/member/personal/update',this.userInfo)
            .then(res => {
              if (res.code == "200") {
                this.$message.success("修改成功");
                localStorage.removeItem("sessionKey");
                localStorage.removeItem("userName");
                this.$router.push("/login");
              } else{
                  this.$message.error("修改失败");
              }
            })
            .catch(res => {
              this.$message.error("修改失败");
            });
        } else {
          return false;
        }
      });
    }

  },
  beforeRouteLeave (to, from, next) {
          this.$store.dispatch('setPwd',false);
          next();
      },
  mounted() {
    const self = this;
    $("#main").slimScroll({
        height: "100%",
        width: "auto",
        wrapperClass: "asidebar",
        color: "gray",
        opacity: 1
      });
     
   self.queryChange();
    window.onresize = () => {
      return (() => {
          self.queryChange();
      })();
    };
  }
};
</script>
 <style lang="scss" scoped>
.el-header {
  padding: 0;
   position: fixed;
   top:0;
   width: 100%;
   z-index:999;
   -webkit-transform: translateZ(0);
}
.el-container {
  min-height: 100%;
 flex: auto;
}
.el-main{
  background: #ecf0f5;
  padding: 0 24px 0 24px;
  margin-top: 60px;
  overflow-x: hidden;
   overflow-y: auto;   
}
.el-aside {
 transition: none !important;
}
.icon-home {
  color: #2691e3;
}

.breadcrumb {
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  li {
    float: left;
    font-size: 14px;
    a {
      color: #999;
    }
  }
}
.right-sider.active {
  right: 0px;
}
.right-sider {
  width: 240px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 2px;
  position: fixed;
  right: -240px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transition: opacity 0.3s, transform 0.3s, right 0.3s, top 0.4s;
  overflow: hidden;
  z-index: 999;
  top: 60px;
  height: 100%;
}


</style>
