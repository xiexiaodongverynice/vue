<template>
  <section class="cms-body zsjc-oprate" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>
    <!-- 右侧栏 -->
    <div class="right-side">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="知识选择" name="first">
          <div class="t-title">关联知识列表</div>
          <el-table :data="knowledgeData.mResult" border style="width: 100%" max-height="250" @row-dblclick="getKnowledgeDetail" ref="table">
            <el-table-column label="词语" prop="name" align="center"></el-table-column>
            <el-table-column prop="name" label="操作" align="center" width="55">
              <div slot-scope="scope">
                <cms-button type="delete" @click.native="removeLinkData(scope.row)"></cms-button>
              </div>
            </el-table-column>
          </el-table>
          <div class="t-title t-form">
            <el-form class="search">
              <el-form-item label="备选知识列表：">
                <el-row :gutter="24">
                  <el-col :span="18">
                    <el-input placeholder="搜索关键词" size="mini" v-model="knowledgeParas.input" prefix-icon="el-icon-search">
                    </el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" size="mini" style="min-width:30px;" @click="getKnowledgeList(2)">go</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="knowledgeData.likeResultList" border style="width: 100%" max-height="250" @row-dblclick="getKnowledgeDetail" ref="table">

            <el-table-column label="词语" prop="name" align="center"></el-table-column>
            <el-table-column prop="name" label="操作" align="center" width="55">
              <div slot-scope="scope">
                <cms-button type="add" @click.native="addLinkData(scope.row)"></cms-button>
              </div>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="划词结果" name="second">
          <div class="t-title">划词结果
            <div class="words-type">
              <button class="jb" @click="switchWordsType('jbmc')" v-bind:class="{current:wordsType === 'jbmc'}"></button>
              <button class="yp" @click="switchWordsType('ypmc')" v-bind:class="{current:wordsType === 'ypmc'}"></button>
              <button class="zb" @click="switchWordsType('jymc')" v-bind:class="{current:wordsType === 'jymc'}"></button>
            </div>
          </div>
          <el-table :data="AllWords" stripe border style="width: 100%" max-height="400">
            <el-table-column label="词语" prop="name" align="center">
            </el-table-column>
            <el-table-column prop="name" label="操作" align="center" width="55">
              <div slot-scope="scope">
                <cms-button type="delete" @click.native="wordDelete(scope.row)"></cms-button>
              </div>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :visible.sync="dialogVisible" :close-on-click-modal=false center>
        <div class="art-title">{{knowledName}}</div>
        <div id="knowledgeDetail">
          <div v-for="item in knowledgeDetail" :key="item.title">
            <div class="word_title">【{{item.title}}】</div>
            <div v-html="item.content"></div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 主工作区 -->
    <div class="main">
      <!-- 标题栏 -->
      <div class="art-title">
        <a class="fanye pre" v-if="prePid!=null" @click="fanye(prePid)">上一条</a>
        <div>{{dataInfo.fName}}</div>
        <div class="fu-biao-ti">
          <span v-if="dataInfo.checkTime">校对时间：{{dataInfo.checkTime}}</span>
          <span v-if="dataInfo.checkUser">校对人：{{dataInfo.checkUser}}</span>
        </div>
        <a class="fanye next" v-if="nextPid!=null" @click="fanye(nextPid)">下一条</a>
      </div>
      <div class="art-body">
        <!-- 操作控制面板 -->
        <div class="inner-bord">
          <div class="kz-pannel">
            <!-- <el-button-group class="hc-xq">
              <el-button @click="switchHuaci(true)" v-bind:class="{current:isSwitch===true}">划词</el-button>
              <el-button @click="switchHuaci(false)" v-bind:class="{current:isSwitch===false}">详情</el-button>
            </el-button-group> -->
            <ul class="class-type" v-bind:class="{hide:isSwitch===false}">
              <li v-bind:class="{current:wordToken.currentCName === 'jbmc'}"><a @click="switchHCType('jbmc')"><i class="icon iconfont icon-jibing jbmc"></i>疾病</a></li>
              <li v-bind:class="{current:wordToken.currentCName === 'ypmc_qt'||wordToken.currentCName === 'ypmc_zn'}"><a @click="switchHCType('ypmc_qt')"><i class="icon iconfont icon-jibing ypmc_qt"></i>药品</a></li>
              <li v-bind:class="{current:wordToken.currentCName === 'jymc'}"><a @click="switchHCType('jymc')"><i class="icon iconfont icon-jibing jymc"></i>指标</a></li>
            </ul>
            <el-upload class="upload-attach" :action="img.uploadUrl" :data="img.data" :multiple="multiple" :name="name" :before-upload="beforeUpload" :on-progress='onProgress' :on-success="onSuccess" :on-error="onError" :show-file-list="false" ref="upload">
              <el-button type="primary" id="upImgBtn">上传图片</el-button>
            </el-upload>
          </div>
          <!-- 内容操作区 -->
          <div id="con_nonParticipleArea" v-bind:class="{hide:isSwitch===false}">

            <template v-for="item in dataInfo.disList">
              <div class="word_title" :key="item.title">【{{item.title}}】</div>
              <div class="word_content word-token-editer-div" :data-type="item.column" :key="item.column" v-html="item.content"></div>
            </template>

          </div>
          <!-- 预览 区域-->
          <div id="con_ProviewArea" v-bind:class="{hide:isSwitch}">
            <template v-for="item in dataInfo.disList">
              <div class="word_title">【{{item.title}}】</div>
              <div v-html="item.content"></div>
            </template>
          </div>

        </div>
      </div>

      <div class="form-footer">
        <el-button type="primary" v-if="dataInfo.checkStatus!='1'" @click="updateStatus()">校对完成</el-button>
      </div>

      <div class="statu-mark" v-if="dataInfo.checkStatus=='1'"></div>
    </div>
    <div class="right-menu" id="rightMenu">
      <el-button type="primary" icon="el-icon-delete" @click="delImg">删除</el-button>
    </div>
  </section>

</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
import wordEdit from "@/mixins/wordEdit";
import { getRand } from "@/untils/random";
import { signParams } from "@/untils/sign";
var rand = getRand();
export default {
  mixins: [formMixns, wordEdit], //普通表单变量
  name: "cms-pictrues-items",
  props: {
    //索引
    index: {
      type: Number,
      default: 0
    },
    src: {
      type: Object,
      default: function() {
        return {
          name: "",
          path: ""
        };
      }
    },
    uploadName: {
      type: String,
      default: "上传"
    },
    //提交地址,默认为/upload/o_upload
    action: {
      type: String,
      default: ""
    },
    //是否支持多文件上传
    multiple: {
      type: Boolean,
      default: false
    },
    //文件提交name值
    name: {
      type: String,
      default: "uploadFile"
    },
    //上传路径
    uploadPath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      beanId: "zsjcJiBingService",
      dialogVisible: false,
      prePid: null,
      nextPid: null,
      params: {
        appId: process.env.appId,
        sessionKey: localStorage.getItem("sessionKey"),
        type: "image",
        nonceStr: rand,
        mark: false,
        uploadPath: this.uploadPath
      },
      img: {
        disabled: true,
        uploadUrl: this.$store.state.sys.baseUrl + this.$api.xinBoUpload,
        data: {},
        uploading: false,
        fileName: ""
      },
      fileList: []
    };
  },
  methods: {
    /**
     * 删除图片
     */
    delImg() {
      let currentImg = document.getElementById("currentImg");
      let paraObj = {
        uploadPath: currentImg.getAttribute("src")
      };
      axios
        .all([
          axios.post(this.$api.xinBoDelImg, paraObj) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            currentImg.parentNode.removeChild(currentImg);
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    // 插入图片
    _insertimg(str) {
      var selection = window.getSelection
        ? window.getSelection()
        : document.selection;
      if (selection.rangeCount < 1) {
        return;
      }
      var range = selection.createRange
        ? selection.createRange()
        : selection.getRangeAt(0);
      if (!window.getSelection) {
        document.getElementById("con_nonParticipleArea").focus();
        range.pasteHTML(str);
        range.collapse(false);
        range.select();
      } else {
        document.getElementById("con_nonParticipleArea").focus();
        range.collapse(false);
        var hasR = range.createContextualFragment(str);
        var hasR_lastChild = hasR.lastChild;
        while (
          hasR_lastChild &&
          hasR_lastChild.nodeName.toLowerCase() == "br" &&
          hasR_lastChild.previousSibling &&
          hasR_lastChild.previousSibling.nodeName.toLowerCase() == "br"
        ) {
          var e = hasR_lastChild;

          hasR_lastChild = hasR_lastChild.previousSibling;

          hasR.removeChild(e);
        }
        range.insertNode(hasR);
        if (hasR_lastChild) {
          range.setEndAfter(hasR_lastChild);

          range.setStartAfter(hasR_lastChild);
        }
        selection.removeAllRanges();
        selection.addRange(range);
      }
    },

    onProgress(event, file, fileList) {
      this.status = "";
      this.uploading = true;
      this.fileName = file.name;
      this.percentage = parseInt(event.percent);
    },
    beforeUpload(file) {
      let self = this;
      let selection = window.getSelection
        ? window.getSelection()
        : document.selection;
      if (selection.rangeCount < 1) {
        return false;
      }
    },
    onSuccess(response, file, fileList) {
      if (response.code == "200" && response.body != "") {
        this.status = "success";
        this.fileList.push({ name: "", path: response.body.uploadPath });
        let imgStr =
          "<img class='disPicture' src='" + response.body.uploadPath + "'/>";
        this._insertimg(imgStr);
      } else {
        this.status = "exception";
        this.errorMessage("上传失败");
      }
      setTimeout(() => {
        this.uploading = false;
        this.fileName = "";
        this.percentage = 0;
      }, 500);
      this.$emit("change", this.fileList); //返回列表
    },

    onError(err, file, fileList) {
      this.errorMessage("上传失败");
      this.$refs["upload"].clearFiles();
      this.$emit("on-error", file, fileList);
      this.$emit("change", this.fileList); //返回列表
    },
    /**
     * 查询页面内容
     */
    getDataInfo(id) {
      //重写获取表单数据
      let api = this.$api; //API地址
      let listCanShu = sessionStorage.getItem("jbListCanShu");
      let canShu = {};
      if (listCanShu && listCanShu != "undefined") {
        canShu = JSON.parse(listCanShu);
      }

      canShu.pid = id;
      let paras = { canShu: JSON.stringify(canShu) };
      axios
        .all([
          axios.post(api.jibingDetail, paras) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            this.loading = false;
            this.dataInfo = data.body.detailData; //将用户数据复制给dataInfo
            this.nextPid = data.body.nextPid;
            this.prePid = data.body.prePid;
          })
        )
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
    this.img.data = signParams(this.params, process.env.appKey);
  },
  updated() {
    //初始获取数据
    let self = this;
    self.iniWte();
    // 详情中链接点击弹出知识详情
    this.xqHrefClick();
    $(document).bind("contextmenu", function(e) {
      if (e.target.className == "disPicture") {
        if (e.which == 3) {
          var currentImg = document.getElementById("currentImg");
          if (currentImg) {
            currentImg.removeAttribute("id");
          }
          var node = e.target;
          node.id = "currentImg";
          var forRight = document.getElementById("rightMenu");
          //显示菜单
          forRight.style.display = "block";
          //菜单定位
          forRight.style.left = e.pageX + "px";
          forRight.style.top = e.pageY + "px";
          //return false为了屏蔽默认事件
        }
      }
      return false;
    });

    // $(".disPicture").mousedown(function (e, a) {});
    $(document).click(function() {
      var forRight = document.getElementById("rightMenu");
      //隐藏菜单
      if (forRight) {
        forRight.style.display = "none";
      }
    });
  }
};
</script>

<style>
.right-menu {
  position: fixed;
  z-index: 99999;
  display: none;
}
</style>
