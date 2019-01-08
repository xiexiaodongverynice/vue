<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
      <div>
        <cms-input label="项目名称" v-model="canShu.name"></cms-input>
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
        <el-button type="primary" icon="el-icon-upload" @click="updateEsData('esDataZhiBiaoService')">更新搜索引擎数据</el-button>
        <el-button @click="jbQuery">查询</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
      <el-table-column prop="jyXmMc" label="项目名称" align="center"></el-table-column>
      <el-table-column prop="shiYongTj" label="适用条件" align="center"></el-table-column>
      <el-table-column prop="biaoZhun" label="标准" align="center"></el-table-column>
      <el-table-column prop="zhiLeiXing" label="值类型" align="center"></el-table-column>
      <el-table-column prop="danWei" label="单位" align="center"></el-table-column>
      <el-table-column prop="yiJiFenLei" label="一级分类" align="center"></el-table-column>
      <el-table-column prop="erJiFenLei" label="二级分类" align="center"></el-table-column>
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
          <!-- <cms-button  type="edit" @click.native="routerLink('/jianYan/edit','edit',scope.row.pid)"
                        v-perms="'/jianYan/edit'"
                    ></cms-button> -->
          <cms-button type="huaci" @click.native="routerLink('/jianYan/oprate','oprate',scope.row.pid)" v-perms="'/jianYan/oprate'"></cms-button>
          <!-- <cms-button type="view" @click.native="routerLink('/jianYan/view','view',scope.row.pid)" v-perms="'/jianYan/view'"></cms-button> -->
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
      sessionStorage.setItem("jyListCanShu", JSON.stringify(this.canShu));
      this.query();
    }
  },
  created() {
    sessionStorage.setItem("jyListCanShu", "");
    this.initTableData(this.$api.jianYanList, this.params);
  }
};
</script>

<style>
</style>
