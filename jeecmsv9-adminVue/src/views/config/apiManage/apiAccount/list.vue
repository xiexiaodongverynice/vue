<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/apiManage/apiAccount/add','save',0)"
              v-perms="'/apiManage/apiAccount/add'"          
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="setAppId" label="APP ID" align="center"></el-table-column>
            <el-table-column prop="disabled" label="禁用" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.disabled">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>
            <el-table-column  label="操作"   align="center">
                     <cms-button type="edit" @click.native="routerLink('/apiManage/apiInfo/edit','update',scope.row.id)"
                        v-perms="'/apiManage/apiInfo/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.apiInfoDelete,scope.row.id)"
                     v-perms="'/apiManage/apiInfo/delete'"                    
                     ></cms-button>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                 
                </div>
             <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 
     </section> 
</template>

<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      params: {//只需要业务参数
        pageNo:'',
        pageSize:'',
  
      }
    };
  },
  created(){
     this.initTableData(this.$api.apiAccountList,this.params);
  }
};
</script>
    
<style>

</style>