<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" 
        class="cms-form" label-width="162px">
        <el-form-item label="机构名称" class="flex-100"  prop="orgId">
                  <el-select v-model="dataInfo.orgId">
                      <el-option 
                        v-for="(item,index) in memberGroup" 
                        :key="index"
                        :label="item.orgName"
                        :value="item.orgCode"
                        ></el-option>
                </el-select>
         </el-form-item>
          
       <el-form-item label="指标编码" class="flex-50" prop="zbbm">
               <el-input v-model="dataInfo.zbbm" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="指标名称" class="flex-50" prop="zbmc">
               <el-input v-model="dataInfo.zbmc" class="cms-width"></el-input>              
         </el-form-item>
           <el-form-item label="指标英文名称" class="flex-50" prop="zbywmc ">
               <el-input v-model="dataInfo.zbywmc " class="cms-width"></el-input>              
         </el-form-item>
       <el-form-item label="生理变化解释" class="flex-100"  prop="slbhjs">
               <el-input v-model="dataInfo.slbhjs" class="cms-width" type="textarea"></el-input>
       </el-form-item>
        
       <el-form-item label="病理增高解释" class="flex-100"  prop="blzgjs">
               <el-input v-model.number="dataInfo.blzgjs" class="cms-width" type="textarea"></el-input>
         </el-form-item>
          <el-form-item label="病理降低解释" class="flex-100" prop="bljdjs">
               <el-input v-model="dataInfo.bljdjs" class="cms-width"  type="textarea"></el-input>              
         </el-form-item>
       <el-form-item label="健康指导" class="flex-100" prop="jkzd">
               <el-input v-model="dataInfo.jkzd" class="cms-width" type="textarea"></el-input>
         </el-form-item>
         <div class="form-footer">
           <el-button type="warning" @click="add(true)">保存并继续添加</el-button>
               <el-button type="primary"  @click="add(false)">提交</el-button>
           <!-- <el-button type="info" @click="reset">重置</el-button> -->
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
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      memberGroup: [], //业务变量会员组
      dataInfo:{
          updateUser:localStorage.getItem('userName')
      },
      param:{
            canShu:{

                },
      },
      rules: {
        //校验规则
        orgId: [required],
        zbbm: [required,number],
        zbmc: [required],
      }
    };
  },
  methods: {
      getDataInfo() {
      //重写获取表单数据
      let api = this.$api; //API地址
      axios
        .all([
         axios.post(api.gettJJglist) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            this.memberGroup = data.body; //将用户数据复制给dataInfo
           
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    add(state) {
      //自定义一下处理方法
      this.param.canShu = JSON.stringify(this.dataInfo);
      this.saveDataInfo(state,this.$api.saveZb,this.param,"targetlist");
    },
    update(){

    }
  },
  created() {
       this.loading=false;
       this.getDataInfo()
  }
};
</script>

<style>

</style>
