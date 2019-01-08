<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
             <!-- <el-form-item label="指标从表id" class="flex-50"  prop="id">
               <el-input :disabled='true' v-model="dataInfo.id" class="cms-width" ></el-input>
            </el-form-item> 
             <el-form-item label="主表id" class="flex-50"  prop="zhuId">
               <el-input :disabled='true' v-model="dataInfo.zhuId" class="cms-width" ></el-input>
            </el-form-item> -->
              <el-form-item label="样本类型" class="flex-50" prop="yblx">
               <el-input v-model="dataInfo.yblx" class="cms-width"></el-input>
        </el-form-item>
      <el-form-item label="性别" class="flex-50" prop="sex">
                <el-select v-model="dataInfo.sex">
                     <el-option label="请选择" value=""></el-option>
                     <el-option label="男" value="男"></el-option>
                     <el-option label="女" value="女"></el-option>
                </el-select>
         </el-form-item>
       <el-form-item label="年龄下限" class="flex-50"  prop="agedi">
               <el-input v-model="dataInfo.agedi" class="cms-width" maxlength="3"></el-input>
       </el-form-item>
        
       <el-form-item label="年龄上限" class="flex-50"  prop="agegao">
               <el-input v-model="dataInfo.agegao" class="cms-width" maxlength="3" ></el-input>
         </el-form-item>
          <el-form-item label="年龄单位" class="flex-100"  prop="agedw">
               <!-- <el-input v-model="dataInfo.agedw" class="cms-width" ></el-input> -->
               <el-select v-model="dataInfo.agedw">
                     <el-option label="请选择" value=""></el-option>
                     <el-option label="年" value="年"></el-option>
                     <el-option label="月" value="月"></el-option>
                     <el-option label="日" value="日"></el-option>
                </el-select>
         </el-form-item>
           <el-form-item label="仪器" class="flex-50" prop="yiqi">
               <el-input v-model="dataInfo.yiqi" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="小组" class="flex-50" prop="xiaozu">
               <el-input v-model="dataInfo.xiaozu" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="正常值下限" class="flex-50" prop="zczxx">
               <el-input v-model="dataInfo.zczxx" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="正常值上限" class="flex-50" prop="zczsx">
               <el-input v-model="dataInfo.zczsx" class="cms-width"></el-input>
         </el-form-item>
          <el-form-item label="单位" class="flex-50"  prop="danwei">
               <el-input v-model="dataInfo.danwei" class="cms-width"></el-input>
         </el-form-item>
          
          <el-form-item label="单位备注" class="flex-50" prop="dwbz">
               <el-input v-model="dataInfo.dwbz" class="cms-width"></el-input>
         </el-form-item>
            <div class="form-footer">
               <el-button type="primary"  @click="update()">修改</el-button>
           <el-button type="info" @click="reset">重置</el-button>
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
    let email = va.email('请输入正确的邮箱地址');
    let validateName = va.validateName('用户名已存在');
    let tel = va.tel('请输入正确的固定电话');
    let mobile = va.mobile('请输入正确的手机号');
    return {
      memberGroup: [], //业务变量会员组
      param:{
        canShu:{

            },
      },
     
      rules: {
        //校验规则
        danwei: [required],
        yblx: [required],
        agedi: [number],
        agegao:[number],
        zczsx:[number],
        zczxx:[number]
      }
    };
  },
  methods: {
    getDataInfo(id) {
      //重写获取表单数据
      let api = this.$api; //API地址
      let params={canShu:JSON.stringify({ id: id })}
      axios
        .all([
          axios.post(api.getZhibiaocb, params), //axios批量发送请求
          axios.post(api.getZhibiaozb, params)
        ])
        .then(
          axios.spread((data, memberGroup) => {
            this.dataInfo = data.body.cb; //将用户数据复制给dataInfo
            this.dataInfo.updateUser = localStorage.getItem('userName')
            this.memberGroup = memberGroup.body; //将用户组数据复制给dataInfo
            this.$refs["form"].resetFields();
            this.loading = false;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    update() {
      this.param.canShu = JSON.stringify(this.dataInfo);
      this.updateDatacbInfo(this.$api.updateCb, this.param, "edit",this.dataInfo.zhuId);
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>