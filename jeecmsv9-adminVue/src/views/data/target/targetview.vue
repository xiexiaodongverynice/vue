<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" class="cms-form" label-width="162px">
             <el-form-item label="机构id" class="flex-50"  prop="orgId">
               <el-input :disabled='true' v-model="dataInfo.orgId" class="cms-width" ></el-input>
            </el-form-item> 
             <el-form-item label="指标编码" class="flex-50"  prop="zbbm">
               <el-input :disabled='true' v-model="dataInfo.zbbm" class="cms-width" ></el-input>
            </el-form-item>
             <el-form-item label="指标名称" class="flex-50"  prop="zbmc">
               <el-input :disabled='true' v-model="dataInfo.zbmc" class="cms-width" ></el-input>
            </el-form-item> 
             <el-form-item label="生理变化解释" class="flex-100" prop="slbhjs">
               <el-input :disabled='true' v-model="dataInfo.slbhjs"  type="textarea" class="cms-width" ></el-input>
            </el-form-item>        
            <el-form-item label="病理增高解释" class="flex-100"  prop="blzgjs">
               <el-input :disabled='true' v-model="dataInfo.blzgjs"   type="textarea" class="cms-width" ></el-input>
            </el-form-item>
             <el-form-item label="病理降低解释" class="flex-100" prop="bljdjs">
               <el-input :disabled='true' v-model="dataInfo.bljdjs"  type="textarea" class="cms-width" ></el-input>
            </el-form-item>    
             <el-form-item label="健康指导" class="flex-100" prop="jkzd">
               <el-input :disabled='true' v-model="dataInfo.jkzd"  type="textarea" class="cms-width"></el-input>
            </el-form-item>  
              <el-form-item label="更新时间" class="flex-50"  prop="updateTime" v-if="dataInfo.updateTime">
               <el-input :disabled='true' v-model="dataInfo.updateTime" class="cms-width"></el-input>
            </el-form-item> 
             <el-form-item label="更新用户" class="flex-50"  prop="updateUser" v-if="dataInfo.updateUser">
               <el-input :disabled='true' v-model="dataInfo.updateUser" class="cms-width"></el-input>
            </el-form-item>     

        </el-form>
        <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="danwei" label="单位" align="center"></el-table-column>
              <el-table-column prop="yblx" label="样本类型" align="center"></el-table-column>
              <!-- <el-table-column prop="sytj" label="适用条件" align="center"> </el-table-column> -->
              <el-table-column prop="agedi" label="年龄低值"  align="center"> </el-table-column>
              <el-table-column prop="agegao" label="年龄高值"   align="center"> </el-table-column>
              <el-table-column prop="agedw" label="年龄单位"  align="center"> </el-table-column>
              <el-table-column prop="yiqi" label="仪器"  align="center"> </el-table-column>
              <el-table-column prop="updateTime" label="更新时间"  align="center"> </el-table-column>
              <el-table-column prop="updateUser" label="更新用户"  align="center"> </el-table-column>
         </el-table>
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
    this.getviewData(this.$api.getZhibiaozb,this.params);
  }
};
</script>

<style>

</style>