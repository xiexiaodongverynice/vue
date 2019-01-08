<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfos" class="cms-form" label-width="162px">
             <el-form-item label="指标从表id" class="flex-50"  prop="id">
               <el-input :disabled='true' v-model="dataInfos.id" class="cms-width" ></el-input>
            </el-form-item> 
             <el-form-item label="主表id" class="flex-50"  prop="zhuId">
               <el-input :disabled='true' v-model="dataInfos.zhuId" class="cms-width" ></el-input>
            </el-form-item>
             <el-form-item label="单位" class="flex-50"  prop="danwei">
               <el-input :disabled='true' v-model="dataInfos.danwei" class="cms-width" ></el-input>
            </el-form-item> 
             <el-form-item label="样本类型" class="flex-100" prop="yblx">
               <el-input :disabled='true' v-model="dataInfos.yblx" class="cms-width" ></el-input>
            </el-form-item>        
            <el-form-item label="适用条件" class="flex-100"  prop="sytj">
               <el-input :disabled='true' v-model="dataInfos.sytj"   type="textarea" class="cms-width" ></el-input>
            </el-form-item>
             <el-form-item label="年龄低值" class="flex-50" prop="agedi">
               <el-input :disabled='true' v-model="dataInfos.agedi"  class="cms-width" ></el-input>
            </el-form-item>
            <el-form-item label="年龄高值" class="flex-50" prop="agegao">
               <el-input :disabled='true' v-model="dataInfos.agegao"   class="cms-width" ></el-input>
            </el-form-item>
            <el-form-item label="年龄单位" class="flex-50" prop="agedw">
               <el-input :disabled='true' v-model="dataInfos.agedw" class="cms-width" ></el-input>
            </el-form-item>
            <el-form-item label="正常值上限" class="flex-50" prop="zczsx">
               <el-input :disabled='true' v-model="dataInfos.zczsx"  class="cms-width" ></el-input>
            </el-form-item>  
             <el-form-item label="正常值下限" class="flex-50" prop="zczxx">
               <el-input :disabled='true' v-model="dataInfos.zczxx"  class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="小组" class="flex-50" prop="xiaozu">
               <el-input :disabled='true' v-model="dataInfos.xiaozu"  class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="仪器" class="flex-50" prop="yiqi">
               <el-input :disabled='true' v-model="dataInfos.yiqi"  class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="单位备注" class="flex-50" prop="dwbz">
               <el-input :disabled='true' v-model="dataInfos.dwbz"  class="cms-width"></el-input>
            </el-form-item>   
              <el-form-item label="更新时间" class="flex-50"  prop="updateTime" v-if="dataInfos.updateTime">
               <el-input :disabled='true' v-model="dataInfos.updateTime" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item label="更新用户" class="flex-50"  prop="updateUser" v-if="dataInfos.updateUser">
               <el-input :disabled='true' v-model="dataInfos.updateUser" class="cms-width"></el-input>
            </el-form-item>     

        </el-form>
    </section>
</template>

<script>
import listMixins from '@/mixins/view';
export default {
    mixins:[listMixins],
    data() {
  
    return {
       canShu: {//只需要业务参数
        id:'',
      },
      id:'',
    };
  },
    
  created(){
    //初始获取数据
    this.id = this.$route.query.id;
    this.canShu.id = this.id;
    this.params.canShu = JSON.stringify(this.canShu);
    this.getviewData(this.$api.getZhibiaocb,this.params);
  }
};
</script>

<style>

</style>