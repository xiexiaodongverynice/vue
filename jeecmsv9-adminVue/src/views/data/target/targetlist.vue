<template>
  <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
            <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/target/add','save',0)"
              v-perms="'/target/add'"
               
              >添加</el-button>
              <el-button type="primary" @click="importData">导入</el-button>
              <el-button type="primary" @click="outportData">导出</el-button>
              <div>
                 <el-select v-model="canShu.orgId" @change="query">
                      <el-option 
                        v-for="(item,index) in memberGroup" 
                        :key="index"
                        :label="item.orgName"
                        :value="item.orgCode"
                        ></el-option>
                </el-select>
                 <cms-input  label="指标编码" v-model="canShu.zbbm"></cms-input>
                 <cms-input  label="指标名称" v-model="canShu.zbmc"></cms-input>
                 <el-button @click="query">查询</el-button>   
              </div>
             
            <!-- 右操作 -->
        </div>
        <!-- 导入 -->
    <el-dialog title="导入" :visible.sync="dialogImportVisible" class="dialog-import">
      <div :class="{'import-content': importFlag === 1, 'hide-dialog': importFlag !== 1}">
        <el-upload class="upload-demo"
        :action="importUrl"
         multiple
        :limit="3"
        :name ="name"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-success="uploadSuccess"
        :with-credentials="withCredentials"
        :data="updata"
        :on-error="uploadFail"
        >
          <el-button size="small" type="primary" :disabled="processing">{{uploadTip}}</el-button>
        </el-upload>
        <div class="content">
          <div class="import-intro">
            <span class="mgr20">导入说明：文件必须xls或xlsx格式</span>
            <el-button><a href="../../src/excel/zbdaoru.xls" download="zbdaoru.xls">下载文件模版</a></el-button>
          </div>
        </div>
        <div :class="{'import-failure': importFlag === 2, 'hide-dialog': importFlag !== 2}" v-if="importFlag == 2" >
        <div class="failure-tips">
          <i class="el-icon-warning" style="color:red"></i>导入失败</div>
        <div class="failure-reason">
          <h4>失败原因</h4>
          <ul>
            <li v-for="(error,index) in errorResults" :key="index">第{{error}}行，数据错误：机构id，指标名称，指标编码为必填项</li>
          </ul>
        </div>
      </div>

      </div>
    </el-dialog>
  

  <!-- 导出 -->
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
               <!-- <el-table-column prop="id" label="指标id" width="50" align="center"></el-table-column> -->
              <el-table-column prop="orgName" label="机构名称" align="center"></el-table-column> 
              <el-table-column prop="zbbm" label="指标编码" align="center"> </el-table-column>
              <el-table-column prop="zbmc" label="指标名称"  align="center"> 
                <div slot-scope="scope">
                    <span class="green" @click="golistview(scope.row.id)">{{scope.row.zbmc}}</span>
                </div>
              </el-table-column>
              <!-- <el-table-column prop="slbhjs" label="生理变化解释"   align="center"> </el-table-column>
              <el-table-column prop="blzgjs" label="病理增高解释"  align="center"> </el-table-column>
              <el-table-column prop="jkzd" label="健康指导"  align="center"> </el-table-column> -->
               <el-table-column prop="updateUser" label="操作人"  align="center"> </el-table-column>
              <el-table-column prop="updateTime" label="操作时间"  align="center"> </el-table-column>
              <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/target/edit','update',scope.row.id)"
                        v-perms="'/target/edit'"
                    
                    ></cms-button>
                     <cms-button type="delete" @click.native="deleteBatch($api.deleteZb,scope.row.id,user)"
                       v-perms="'/target/delete'"
                     ></cms-button>
                        <!-- <cms-button type="view" @click.native="routerLink('/target/targetview','',scope.row.id)"
                       v-perms="'/target/targetview'"
                     ></cms-button> -->
                      <!-- <cms-button type="user" @click.native="routerLink('/target/attachedlist','update',scope.row.id)"
                        v-perms="'/target/attachedlist'"
                    ></cms-button> -->
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <!-- cms分页组件 -->
              <div class="cms-left">
                <el-button :disabled="disabled" @click="deleteBatch($api.deleteZb,ids,user)"
                  v-perms="'/target/delete'"
                >批量删除</el-button>
              </div>
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 
  </section>
</template>

<script>
import listMixins from '@/mixins/xinboList'
import axios from "axios";
import { getRand } from "@/untils/random";
import { signParams } from "@/untils/sign";
var rand = getRand();
export default {
    mixins:[listMixins],
  data() {
     let self=this;
    return {
      memberGroup:[],
      canShu: {//只需要业务参数
        pageNo: 1,
        pageSize: 10,
        zbbm:'',
        zbmc:'',
        orgId:'400686566',
        user:localStorage.getItem('userName')
      },
      user:'',
      multipleSelection: [],
      importUrl:'',
      importHeaders:{
       'Content-Type':'multipart/form-data',
        // 'Content-Type':false
      },
      name: 'uploadFile',
      fileList: [],
      withCredentials: true,
      fileName:'',
      processing: false,
      uploadTip:'点击上传',
      importFlag:1,
      dialogImportVisible:false,
      errorResults:[],
      updata:{
        appId: process.env.appId,
        sessionKey: localStorage.getItem("sessionKey"),
        type: "attach",
        nonceStr: rand,
        mark: false,
        user: localStorage.getItem('userName'),
        siteId: localStorage.getItem("_site_id_param"),
        sign: "",
        nonce_str:localStorage.getItem("nonce_str"),
      },
    };
  },
  methods: {
    getDataInfo() {
      //重写获取表单数据
      let api = this.$api; //API地址
      axios
        .all([
         axios.post(api.getcxGglist) //axios批量发送请求
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
    //点击上传
    importData() {
      this.importFlag = 1
      this.fileList = []
      this.uploadTip = '点击上传'
      this.processing = false
      this.dialogImportVisible = true
    },
    beforeUpload(file){
                console.log(file,'文件');
                this.files = file;
                const extension = file.name.split('.')[1] === 'xls'
                const extension2 = file.name.split('.')[1] === 'xlsx'
                // const isLt2M = file.size / 1024 / 1024 < 5(校验上传文件的大小)
                if (!extension && !extension2) {
                    this.$message.warning('上传文档只能是 xls、xlsx格式!')
                    return
                }
                console.log(file.name);
                this.fileName = file.name;
                this.uploadTip = '正在处理中...'
                this.processing = true


 },
 //上传错误
    uploadFail(err, file, fileList) {
      this.uploadTip = '点击上传'
      this.processing = false
      this.$message.error(err)
 },
 //上传成功
 uploadSuccess(response, file, fileList) {
      console.log(response,"555")
      this.uploadTip = '点击上传'
      this.processing = false
      if (response.code == "307") {
        this.errorResults = response.body.error
        if (this.errorResults) {
           this.uploadTip = '请重新上传'
          this.importFlag = 2
        } else {
          this.dialogImportVisible = false
          this.$message.error(response.message)
        }
      } else {
        this.importFlag = 3
        this.dialogImportVisible = false
        this.$message.info('导入成功,请稍后手动刷新页面')
        // this.initTableData(this.$api.getTargetlist,this.params);
      }
    },
  
    importSubmit(){
            let vm = this;
           if(this.fileName==""){
                   this.$message.warning('请选择要上传的文件！')
                   return false
              }
            let api = this.$api; //API地址
            let fileFormData = new FormData();
               fileFormData.append('file', this.files);
               let config = {
                // 一定要定义头
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                 }
            let params = {file:fileFormData}
        axios
        .all([
         axios.post(api.importxlstoFastDFS,params,config) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
              vm.dialogImportVisible=false;
             this.$message({
                        message: '导入成功',
                        type: 'success'
                    });
          })
        )
      },
    outportData() {
      // this.downloadTemplate()
       this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.excelData = this.tableData //你要导出的数据list。
                    this.export2Excel()
                }).catch(() => {
                
                });
    },
    golistview(id){
        this.routerLink('/target/targetview','',id)
    },
    export2Excel() {
                var that = this;
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../../excel/Export2Excel'); //这里必须使用绝对路径
                    const tHeader = ['机构id','指标编码','指标名称','生理变化解释', '病理性增高解释', '病理性减低解释','健康指导','检查意义','指标英文名称']; // 导出的表头名
                    const filterVal = ['orgId','zbbm','zbmc','slbhjs','blzgjs', 'bljdjs','jkzd','jcyy','zbywmc']; // 导出的表头字段名
                    const list = that.excelData;
                    const data = that.formatJson(filterVal, list);
                    let time1,time2 = '';
                    export_json_to_excel(tHeader, data);// 导出的表格名称，根据需要自己命名
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
    // beforeUpload(file){
    //   //上传前配置
    //   // this.importHeaders.cityCode='北京'//可以配置请求头
    //   let excelfileExtend = ".xls,.xlsx"//设置文件格式
    //   let fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
    //   let api = this.$api;
    //   this.updata.canShu.path = file
    //   // this.updata = {canShu:JSON.stringify(this.updata)}
    //   let params={canShu:JSON.stringify({ path:'C:/Users/Administrator/Desktop/zbdaoru.xls',user: localStorage.getItem('userName')})}
    //   // let fd = new FormData();
    //   // fd.append('path',file);//传文件
    //   // fd.append('user',localStorage.getItem('userName'));//传其他参数
    //   // // axios.post('/api/up/file',fd).then(function(res){
    //   // //         alert('成功');
    //   // // })
     
    //   if (excelfileExtend.indexOf(fileExtend) <= -1) {
    //      this.$message.error('文件格式错误')
    //      return false
    //   }
    //   this.uploadTip = '正在处理中...'
    //   this.processing = true
    //     // axios
    //     // .all([
    //     //  axios.post(api.importxls,params) //axios批量发送请求
    //     // ])
    //     // .then(
    //     //   axios.spread(data => {
           
    //     //   })
    //     // )
    // },
    // //上传成功
    // uploadSuccess(response, file, fileList) {
    //   console.log(file,"123")
    //   this.uploadTip = '点击上传'
    //   this.processing = false
    //   if (response.status === -1) {
    //     this.errorResults = response.data
    //     if (this.errorResults) {
    //       this.importFlag = 2
    //     } else {
    //       this.dialogImportVisible = false
    //       this.$message.error(response.errorMsg)
    //     }
    //   } else {
    //     this.importFlag = 3
    //     this.dialogImportVisible = false
    //     this.$message.info('导入成功')
    //   }
    // },
  },
  created(){
      var sign = signParams(this.updata,process.env.appKey);
     this.updata.sign = sign
     this.importUrl = this.$api.importxlstoFastDFS
     this.getDataInfo();
     this.user = this.canShu.user
     this.params.canShu = JSON.stringify(this.canShu);
     this.initTableData(this.$api.getTargetlist,this.params);
    
  }
};
</script>

<style>

</style>
