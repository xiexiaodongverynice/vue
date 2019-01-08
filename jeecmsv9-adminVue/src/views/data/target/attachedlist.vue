<template>
  <section v-loading="loading" class="cms-body">
       <cms-back></cms-back>        
        <div class="cms-list-header flex-between">
            <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/target/attachedadd','save',id)"
              v-perms="'/target/attachedadd'"
               
              >添加</el-button>
             
            <!-- 右操作 -->
        </div>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="center"></el-table-column>
              <el-table-column prop="danwei" label="单位" align="center"></el-table-column>
              <el-table-column prop="yblx" label="样本类型" align="center"></el-table-column>
              <!-- <el-table-column prop="sytj" label="适用条件" align="center"> </el-table-column> -->
              <el-table-column prop="agedi" label="年龄低值"  align="center"> </el-table-column>
              <el-table-column prop="agegao" label="年龄高值"   align="center"> </el-table-column>
              <el-table-column prop="agedw" label="年龄单位"  align="center"> </el-table-column>
              <el-table-column prop="yiqi" label="仪器"  align="center"> </el-table-column>
              <el-table-column prop="updateTime" label="更新时间"  align="center"> </el-table-column>
              <el-table-column prop="updateUser" label="更新用户"  align="center"> </el-table-column>
              <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/target/attachededit','update',scope.row.id)"
                        v-perms="'/target/attachededit'"
                    
                    ></cms-button>
                     <cms-button type="delete" @click.native="deleteBatch($api.deleteCb,scope.row.id,user)"
                       v-perms="'/target/delete'"
                     ></cms-button>
                        <cms-button type="view" @click.native="routerLink('/target/attachedview','',scope.row.id)"
                       v-perms="'/target/attachedview'"
                     ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <!-- cms分页组件 -->
              <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.deleteCb,ids,user)"
                  v-perms="'/target/delete'"
                >批量删除</el-button>
              </div>
          </div> 
  </section>
</template>

<script>
import listMixins from '@/mixins/view'
export default {
    mixins:[listMixins],
  data() {
    return {
      canShu: {//只需要业务参数
        id:'',
        user:localStorage.getItem('userName')
      },
      id:'',
      user:''
    };
  },
  created(){
     this.user = this.canShu.user
     this.id = this.$route.query.id;
     this.canShu.id = this.id;
     this.params.canShu = JSON.stringify(this.canShu);
     this.getviewData(this.$api.getZhibiaozb,this.params);
  }
};
</script>

<style>

</style>
