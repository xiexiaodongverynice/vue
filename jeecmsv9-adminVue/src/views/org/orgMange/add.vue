<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo"  :rules="rules" 
        class="cms-form" label-width="162px">
       <el-form-item label="机构代码" class="flex-50" prop="orgCode">
               <el-input v-model="dataInfo.orgCode" class="cms-width"></el-input>
         </el-form-item>
        <el-form-item label="机构名称" class="flex-50"  prop="orgName">
              <el-input v-model="dataInfo.orgName" class="cms-width"></el-input>
        </el-form-item>
       <el-form-item label="APPID" class="flex-50" prop="orgAppid">
               <el-input v-model="dataInfo.orgAppid" class="cms-width"></el-input>
         </el-form-item>
       <el-form-item label="APPSECRET" class="flex-50" prop="orgAppsecret">
               <el-input v-model="dataInfo.orgAppsecret" class="cms-width"></el-input>
         </el-form-item>
         <el-form-item label="首页目录名" class="flex-50" prop="folderName">
               <el-input v-model="dataInfo.folderName" class="cms-width"></el-input>
         </el-form-item>
       <el-form-item label="首页文件名" class="flex-50" prop="indexFileName">
               <el-input v-model="dataInfo.indexFileName" class="cms-width"></el-input>
         </el-form-item>
           <el-form-item label="科室转换接口地址" class="flex-50" prop="keshiZhuanhuanUrl">
               <el-input v-model="dataInfo.keshiZhuanhuanUrl" class="cms-width"></el-input>
         </el-form-item>
       <el-form-item label="挂号接口地址" class="flex-50" prop="guahaoUrl">
               <el-input v-model="dataInfo.guahaoUrl" class="cms-width"></el-input>
         </el-form-item>
         <el-form-item label="医院用户信息接口" class="flex-50" prop="yiyuanyonghuxinxiUrl">
               <el-input v-model="dataInfo.yiyuanyonghuxinxiUrl" class="cms-width"></el-input>
         </el-form-item>
         <div class="form-footer">
           <el-button type="warning" @click="add(true)">保存并继续添加</el-button>
               <el-button type="primary"  @click="add(false)">提交</el-button>
           <el-button type="info" @click="reset">重置</el-button>
           <span class="gray">
              选择“保存并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
         </div>
    </el-form>
  
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";

export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;

    let required = va.required("此项必填");
    let url = va.url("请输入正确的URL");
    return {
      memberGroup: [], //业务变量会员组
      dataInfos:{
          updateUser:localStorage.getItem('userName')
      },
      rules: {
        //校验规则
        orgName: [required],
        orgCode: [required],
        orgAppid: [required],
        orgAppsecret: [required],
        keshiZhuanhuanUrl:[url],
        folderName:[required],
        indexFileName:[required],
        guahaoUrl:[url],
        yiyuanyonghuxinxiUrl:[url]
      }
    };
  },
  methods: {
    getDataInfo(id) {
      //重写获取表单数据
      let api = this.$api; //API地址
      let paras={canShu:JSON.stringify({ id: id })};
      axios
        .all([
         // axios.post(api.orgQueryOne, paras) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            this.dataInfo = data.body; //将用户数据复制给dataInfo
            this.dataInfo.orgName = "";
            this.dataInfo.orgCode = "";
            this.dataInfo.orgAppid = "";
            this.dataInfo.orgAppsecret = "";
            this.$refs["form"].resetFields();
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },

    add(state) {
      //自定义一下处理方法
         let fifter = {
        Info:this.dataInfo,
       
        // config:this.dataInfos,
      };
       fifter.Info.updateUser = this.dataInfos.updateUser
      let paras = { canShu: JSON.stringify(fifter) };
      this.saveDataInfo(state, this.$api.orgEdit, paras, "list");
    },
    update() {}
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>
</style>
