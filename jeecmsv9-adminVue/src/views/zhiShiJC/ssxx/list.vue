<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
      <div>
        <cms-input label="膳食名称" v-model="canShu.name"></cms-input>
        <cms-input label="校对人" v-model="canShu.checkUser"></cms-input>
      </div>
      <div>
        <el-select v-model="canShu.checkStatus" @change="jbQuery">
          <el-option label="全部" value=""></el-option>
          <el-option label="未校对" value="0"></el-option>
          <el-option label="校对完成" value="1"></el-option>
        </el-select>
        <el-date-picker v-model="canShu.dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>

      </div>
    </div>
    <div class="cms-list-header flex-between">
      <div>
      </div>

      <!-- 右操作 -->
      <div>
        <el-button @click="jbQuery">查询</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
      <el-table-column prop="shanShiMing" label="膳食名称" align="center"></el-table-column>
      <el-table-column prop="checkTime" label="校对时间" align="center"> </el-table-column>
      <el-table-column prop="checkUser" label="校对人" width="90" align="center"> </el-table-column>
      <el-table-column prop="checkStatus" label="校对状态" width="90" align="center">
        <div slot-scope="scope">
          <span v-if="scope.row.checkStatus==1" class="green">校对完成</span>
          <span v-else class="red">未校对</span>
        </div>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="90" align="center">
        <div slot-scope="scope">
          <!-- <cms-button  type="edit" @click.native="routerLink('/ssxx/edit','edit',scope.row.pid)"
                        v-perms="'/ssxx/edit'"
                    ></cms-button> -->
          <cms-button type="huaci" @click.native="routerLink('/ssxx/oprate','oprate',scope.row.pid)" v-perms="'/ssxx/oprate'"></cms-button>
          <!-- <cms-button type="view" @click.native="routerLink('/ssxx/view','view',scope.row.pid)" v-perms="'/ssxx/view'"></cms-button> -->
        </div>
      </el-table-column>

    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
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
        name: "",
        dateRange: null,
        checkUser: "",
        checkStatus: "",
        pageNo: null,
        pageSize: 10
      }
    };
  },
  methods: {
    jbQuery() {
      this.canShu.pageNo=null;
      sessionStorage.setItem("ssListCanShu", JSON.stringify(this.canShu));
      this.query();
    }
  },
  created() {
    sessionStorage.setItem("ssListCanShu", "");
    this.initTableData(this.$api.ssxxList, this.params);
  }
};
</script>

<style>
</style>
