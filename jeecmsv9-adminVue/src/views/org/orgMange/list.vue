<template>
  <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
            <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/org/save','save',0)"
              v-perms="'/org/save'"
              >添加</el-button>
            <!-- 右操作 -->
             <div>
                <el-select v-model="canShu.queryStatus" @change="query">
                     <el-option label="状态" value=""></el-option>
                     <el-option label="正常" value="0"></el-option>
                     <el-option label="失效" value="1"></el-option>
                     <el-option label="待处理" value="2"></el-option>
                </el-select>
                 <cms-input  label="机构名称" v-model="canShu.queryOrgName"></cms-input>
                 <cms-input  label="机构代码" v-model="canShu.queryOrgCode"></cms-input>
                <el-button @click="query">查询</el-button>                
            </div>
        </div>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
              <el-table-column prop="orgCode" label="机构代码" align="center"></el-table-column>
              <el-table-column prop="orgName" label="机构名称" align="left"></el-table-column>
              <el-table-column prop="orgAppid" label="APPID" align="center"> </el-table-column>
              <el-table-column prop="orgAppsecret" label="APPSECRET"  align="center"> </el-table-column>
              <el-table-column prop="" label="状态"   align="center">
                <div slot-scope="scope">
                  <span v-if="scope.row.status=='0'" class="green">正常</span> 
                  <span v-if="scope.row.status=='1'" class="red">失效</span> 
                  <span v-if="scope.row.status==null">待处理</span> 
                </div>
              </el-table-column>
               <el-table-column prop="updateUser" label="操作人"  align="center"> </el-table-column>
              <el-table-column prop="updateDate" label="操作时间"  align="center" :formatter="dateFormat"> </el-table-column>
              <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/org/update','update',scope.row.pid)"
                        v-perms="'/org/update'"
                    
                    ></cms-button>
                     <cms-button type="rename" @click.native="unpdatestatus($api.orgUnpdate,scope.row.pid,scope.row.status)"
                       v-perms="'/org/unpdatestatus'"
                     ></cms-button>
                      <cms-button type="delete" v-if="scope.row.status==null" @click.native="deleteBatch($api.orgdel,scope.row.pid)"
                       v-perms="'/org/delete'"
                     ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.orgdel,ids)"
                    v-perms="'/org/delete'"
                  >批量删除</el-button>
                </div>
                <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 
  </section>
</template>

<script>
import listMixins from "@/mixins/xinboList";
export default {
  mixins: [listMixins],
  data() {
    return {
      canShu: {
        //只需要业务参数
        queryOrgName: "",
        queryOrgCode: "",
        queryStatus: "",
        pageNo: "",
        pageSize: "10"
      }
    };
  },
  methods: {
    dateFormat: function(row, column) {
      const dateStr = row[column.property];
      if (dateStr == undefined) {
        return "";
      }
      const dateMat = new Date(dateStr);
      const year = dateMat.getFullYear();
      const month = dateMat.getMonth() + 1;
      const day = dateMat.getDate();
      const hh = dateMat.getHours();
      const mm = dateMat.getMinutes();
      const ss = dateMat.getSeconds();
      return year + "/" + month + "/" + day + " " + hh + ":" + mm + ":" + ss;
    }
  },
  created() {
    this.params.canShu = JSON.stringify(this.canShu);
    this.initTableData(this.$api.orgList, this.params);
  }
};
</script>

<style>
</style>
