<template>
  <section class="cms-body zsjc-oprate" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>
    <!-- 右侧栏 -->
    <div class="right-side">
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="知识选择" name="first">
          <div class="t-title">关联知识列表</div>
          <el-table :data="knowledgeData.mResult" border style="width: 100%" max-height="250" @row-dblclick="removeLinkData" ref="table">
            <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
            <el-table-column label="词语" prop="name" align="center"></el-table-column>
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
          <el-table :data="knowledgeData.likeResultList" border style="width: 100%" max-height="250" @row-dblclick="addLinkData" ref="table">
            <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
            <el-table-column label="词语" prop="name" align="center"> </el-table-column>
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
          <el-table :data="AllWords" stripe border style="width: 100%" max-height="400" @row-dblclick="wordDelete">
            <el-table-column label="词语" prop="name" align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </div>
    <!-- 主工作区 -->
    <div class="main">
      <!-- 标题栏 -->
      <div style="" class="art-title">
        {{dataInfo.fName}}
      </div>
      <div class="art-body">
        <!-- 操作控制面板 -->
        <div class="inner-bord">
          <div class="kz-pannel">
            <el-button-group class="hc-xq">
              <el-button @click="switchHuaci(true)" v-bind:class="{current:isSwitch===true}">划词</el-button>
              <el-button @click="switchHuaci(false)" v-bind:class="{current:isSwitch===false}">详情</el-button>
            </el-button-group>
            <ul class="class-type" v-bind:class="{hide:isSwitch===false}">
              <li v-bind:class="{current:wordToken.currentCName === 'jbmc'}"><a @click="switchHCType('jbmc')"><i class="icon iconfont icon-jibing jbmc"></i>疾病</a></li>
              <li v-bind:class="{current:wordToken.currentCName === 'ypmc_qt'||wordToken.currentCName === 'ypmc_zn'}"><a @click="switchHCType('ypmc_qt')"><i class="icon iconfont icon-jibing ypmc_qt"></i>药品</a></li>
              <li v-bind:class="{current:wordToken.currentCName === 'jymc'}"><a @click="switchHCType('jymc')"><i class="icon iconfont icon-jibing jymc"></i>指标</a></li>
            </ul>
          </div>
          <!-- 内容操作区 -->
          <div id="con_nonParticipleArea" v-bind:class="{hide:isSwitch===false}">
            <div class="word_title">【概述】</div>
            <div class="word_content word-token-editer-div" data-type="fGaiShuDis" v-html="dataInfo.fGaiShuDis"></div>
            <div class="word_title">【临床表现】</div>
            <div class="word_content word-token-editer-div" data-type="fLinChuangTeDianDis" v-html="dataInfo.fLinChuangTeDianDis"></div>
            <div class="word_title">【诊断要点】</div>
            <div class="word_content word-token-editer-div" data-type="fZhiLiaoDis" v-html="dataInfo.fZhiLiaoDis"></div>
          </div>
          <!-- 预览 区域-->
          <div id="con_ProviewArea" v-bind:class="{hide:isSwitch}">
            <div class="word_title">【概述】</div>
            <div class="word_content word-token-editer-div" data-type="fGaiShuDis" v-html="dataInfo.fGaiShuDis"></div>
            <div class="word_title">【临床表现】</div>
            <div class="word_content word-token-editer-div" data-type="fLinChuangTeDianDis" v-html="dataInfo.fLinChuangTeDianDis"></div>
            <div class="word_title">【诊断要点】</div>
            <div class="word_content word-token-editer-div" data-type="fZhiLiaoDis" v-html="dataInfo.fZhiLiaoDis"></div>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <el-button type="primary" v-if="dataInfo.checkStatus!=1" @click="updateStatus()">校对完成</el-button>
      </div>
    </div>

  </section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";

export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let required = va.required("此项必填");
    return {
      activeName: "first",
      knowledgeParas: {
        type: "",
        text: "",
        input: ""
      },
      rules: {
        //校验规则
      },
      wte: null,
      isSwitch: true, //划词状态(true-划词,false-预览)
      temp_currentNode: null, //当前操作节点
      wordToken: {
        currentCName: "jbmc", //当前划词分类class
        currenClickName: "疾病", //当前划词分类名
        currenService: "jiBingKnowledgeService", //当前划词分类service
        currenZiDuan: null //当前操作字段
      },
      knowledgeData: {},
      AllWords: [],
      wordsType: ""
    };
  },
  methods: {
    /**
     * 划词列表中删除划词
     */
    wordDelete(row) {
      this.knowledgeData= {};
      let cl = "";
      if (this.wordsType != "") {
        cl = row.type;
      }
      let parent = document.getElementById("con_nonParticipleArea");

      let aEles = [];
      let spanEles = [];
      if (cl == "") {
        aEles = parent.getElementsByClassName("word-token-editer-a");
      } else {
        aEles = parent.getElementsByClassName(cl);
      }
      let id = row.index;
      // 删除链接
      aEles[id].setAttribute("id", "curNd");
      this.wordToken.currenZiDuan = aEles[id].parentNode.getAttribute(
        "data-type"
      );
      this.wte.cleanNode(aEles[id]);
      $("#con_ProviewArea").html(this.wte.contents());
      this.updateDis(); //保存html
      this.getAllWords(); //重新获取划词列表
    },
    /**
     * 切换划词列表类型
     */
    switchWordsType(type) {
      if (this.wordsType == type) {
        this.wordsType = "";
      } else {
        this.wordsType = type;
      }
      this.getAllWords();
    },

    /**
     * 右侧tab点击事件
     */
    tabClick(tab) {
      if (tab.index != "1") {
        return;
      }
      this.getAllWords();
    },

    /**
     * 返回所有划词
     */
    getAllWords() {
      this.AllWords = [];
      let cl = "";
      if (this.wordsType != "") {
        cl = this.wordsType;
      }
      let parent = document.getElementById("con_nonParticipleArea");

      let aEles = [];
      let spanEles = [];
      if (cl == "") {
        aEles = parent.getElementsByClassName("word-token-editer-a");
      } else {
        if (cl == "ypmc") {
          let ypzn = "ypmc_zn";
          let ypqt = "ypmc_qt";
          let ypznEles = parent.getElementsByClassName(ypzn);
          let ypqtEles = parent.getElementsByClassName(ypqt);
          for (let i = 0; i < ypznEles.length; i++) {
            let wtype = "ypmc_zn";
            let wObj = { index: i, name: ypznEles[i].innerHTML, type: wtype };
            this.AllWords.push(wObj);
          }
          for (let i = 0; i < ypqtEles.length; i++) {
            let wtype = "ypmc_qt";
            let wObj = { index: i, name: ypqtEles[i].innerHTML, type: wtype };
            this.AllWords.push(wObj);
          }
        } else {
          aEles = parent.getElementsByClassName(cl);
        }
      }
      for (let i = 0; i < aEles.length; i++) {
        let wtype = null;
        if (aEles[i].classList.contains("jbmc")) {
          wtype = "jbmc";
        } else if (aEles[i].classList.contains("jymc")) {
          wtype = "jymc";
        } else if (aEles[i].classList.contains("ypmc_zn")) {
          wtype = "ypmc_zn";
        } else if (aEles[i].classList.contains("ypmc_qt")) {
          wtype = "ypmc_qt";
        }
        let wObj = { index: i, name: aEles[i].innerHTML, type: wtype };
        this.AllWords.push(wObj);
      }
    },
    /**
     * 校对完成提交
     */
    updateStatus() {
      this.loading = true;
      let paras = {
        canShu: JSON.stringify({
          pid: this.id,
          checkUser: localStorage.getItem("userName")
        })
      };
      axios
        .all([axios.post(this.$api.updateStatus, paras)])
        .then(
          axios.spread(data => {
            this.successMessage("提交成功");
            setTimeout(() => {
              this.routerLink("list");
            }, 1000);
            this.loading = false;
          })
        )
        .catch(err => {});
    },
    /**
     * span标签转a标签
     */
    spanToA() {
      let oldNode = document.getElementById("curNd");
      let newNode = document.createElement("a");
      newNode.innerHTML = oldNode.innerHTML;
      newNode.classList = oldNode.classList;
      newNode.classList.add("aunderline");
      if (this.wordToken.currentCName === "ypmc_qt") {
        newNode.classList.remove("ypmc_qt");
        newNode.classList.add("ypmc_zn");
      }

      this.updateLinkStr(newNode);
      oldNode.parentNode.replaceChild(newNode, oldNode);
      //this.temp_currentNode.parentNode.replaceChild(newNode, this.temp_currentNode);
      $("#con_ProviewArea").html(this.wte.contents());
      newNode.setAttribute("id", "curNd");
      this.updateDis(); //保存
    },
    /**
     * a标签转span
     */
    aToSpan() {
      let oldNode = document.getElementById("curNd");
      let newNode = document.createElement("span");
      newNode.innerHTML = oldNode.innerHTML;
      newNode.classList = oldNode.classList;
      newNode.classList.remove("aunderline");
      if (this.wordToken.currentCName === "ypmc_zn") {
        newNode.classList.remove("ypmc_zn");
        newNode.classList.add("ypmc_qt");
      }
      oldNode.parentNode.replaceChild(newNode, oldNode);
      $("#con_ProviewArea").html(this.wte.contents());
      this.updateDis(); //保存
    },

    /**
     * 标签点击链接修改
     */
    updateLinkStr() {
      let node = arguments[0] ? arguments[0] : document.getElementById("curNd");
      if (this.knowledgeData.mResult.length > 0) {
        let clickType = this.wordToken.currenClickName;
        let itemArr = [];
        for (let i = 0; i < this.knowledgeData.mResult.length; i++) {
          itemArr.push(this.knowledgeData.mResult[i].name);
        }
        let clickContent =
          "yaopinlist('" + itemArr.join("@fg#") + "','" + clickType + "')";
        node.setAttribute("ng-click", clickContent);
      } else {
        node.setAttribute("ng-click", clickContent);
      }
    },
    /**
     * 添加关联词
     */
    addLinkData(row) {
      this.knowledgeData.mResult.push(row);
      let index = this.knowledgeData.likeResultList.indexOf(row);
      this.knowledgeData.likeResultList.splice(index, index + 1);
      if (this.knowledgeData.mResult.length > 1) {
        this.updateLinkStr();
        $("#con_ProviewArea").html(this.wte.contents());
        this.updateDis(); //保存
      } else {
        this.spanToA();
      }
    },
    /**
     *删除关联词
     */
    removeLinkData(row) {
      this.knowledgeData.likeResultList.push(row);
      let index = this.knowledgeData.mResult.indexOf(row);
      this.knowledgeData.mResult.splice(index, index + 1);
      if (this.knowledgeData.mResult.length > 0) {
        this.updateLinkStr();
        $("#con_ProviewArea").html(this.wte.contents());
        this.updateDis(); //保存
      } else {
        this.aToSpan();
      }
    },
    /**
     * 保存文章内容
     */
    updateDis() {
      let node = $("#con_ProviewArea #curNd");
      if (node && node.length > 0) {
        node[0].removeAttribute("id");
      }
      let api = this.$api; //API地址
      //this.loading = true;
      let zd = this.wordToken.currenZiDuan; //得到当前操作节点所在字段名得到当前操作节点所在字段名
      let disContent = $("#con_ProviewArea")
        .find("[data-type='" + zd + "']")
        .html(); //得到当前操作段落内容
      let paras = {
        canShu: JSON.stringify({
          pid: this.id,
          ziDuan: zd,
          disContent: disContent
        })
      };
      axios
        .all([axios.post(api.updateDis, paras)])
        .then(axios.spread(data => {}))
        .catch(err => {});
    },

    /**
     * 查询关联词语
     * type(1-划词查询,2-关键字查询,3-点击词)
     */
    getKnowledgeList(type) {
      //重写获取表单数据
      let api = this.$api; //API地址
      if (type === 1 || type === 3) {
        // 划词
        this.knowledgeParas.input = null;
      }
      if (type === 2) {
        // 关键字搜索
        this.knowledgeParas.text = null;
      }
      this.knowledgeParas.type = this.wordToken.currenService;
      let paras = { canShu: JSON.stringify(this.knowledgeParas) };
      axios
        .all([
          axios.post(api.getKnowledgeList, paras) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            if (data.body) {
              this.knowledgeData = data.body; //将用户数据复制给dataInfo
              this.knowledgeData.mResult = [];
              let obj = null;
              if (
                data.body.matchedResult &&
                data.body.matchedResult.length > 0
              ) {
                obj = { name: data.body.matchedResult };
              }
              if (type === 1) {
                if (obj != null) {
                  this.knowledgeData.mResult.push(obj);
                  this.spanToA();
                } else {
                  $("#con_ProviewArea").html(this.wte.contents());
                  this.updateDis(); //保存
                }
              }
              if (type === 3) {
                let node = document.getElementById("curNd");
                if (node.nodeName == "SPAN" && obj != null) {
                  this.knowledgeData.likeResultList.unshift(obj);
                } else {
                  //this.knowledgeData.mResult
                  let clStr = node.getAttribute("ng-click");
                  let st = clStr.indexOf("(");
                  let end = clStr.indexOf("','");
                  let cyStr = clStr.substring(st + 2, end);
                  let cyArr = cyStr.split("@fg#");
                  for (let i = 0; i < cyArr.length; i++) {
                    let obj = { name: cyArr[i] };
                    this.knowledgeData.mResult.push(obj);
                    for (
                      let j = 0;
                      j < this.knowledgeData.likeResultList.length;
                      j++
                    ) {
                      if (
                        cyArr[i] == this.knowledgeData.likeResultList[j].name
                      ) {
                        this.knowledgeData.likeResultList.splice(j, 1);
                      }
                    }
                  }
                }
              }
            }
          })
        )
        .catch(err => {});
    },
    /**
     * 划词开关
     */
    switchHuaci(value) {
      this.isSwitch = value;
    },
    /**
     * 类型开关（疾病，药品、指标）
     */
    switchHCType(value) {
      this.knowledgeData = {};
      switch (value) {
        case "jbmc":
          this.wordToken.currentCName = "jbmc";
          this.wordToken.currenService = "jiBingKnowledgeService";
          this.wordToken.currenClickName = "疾病";
          break;
        case "ypmc_zn":
          this.wordToken.currentCName = "ypmc_zn";
          this.wordToken.currenService = "yaoPinKnowledgeService";
          this.wordToken.currenClickName = "药品";
          break;
        case "ypmc_qt":
          this.wordToken.currentCName = "ypmc_qt";
          this.wordToken.currenService = "yaoPinKnowledgeService";
          this.wordToken.currenClickName = "药品";
          break;
        case "jymc":
          this.wordToken.currentCName = "jymc";
          this.wordToken.currenService = "zhiBiaoKnowledgeService";
          this.wordToken.currenClickName = "检验";
          break;
      }
    },

    iniWte() {
      var self = this;
      var con_ProviewArea = document.getElementById("con_ProviewArea");
      var con_nonParticipleArea = document.getElementById(
        "con_nonParticipleArea"
      );

      var text = $(con_nonParticipleArea)
        .find(".word_title:first")
        .parent()
        .html();

      self.wte = $.wordTokenEditer({
        editable: false,
        dom: $(con_nonParticipleArea),
        block: "word_content",
        disableColor: "#aaa",
        text: text,
        callback: function(obj) {
          var action = obj.action;
          var types = obj.types;
          var text = obj.text;
          self.wordToken.currenZiDuan = obj.node.parentNode.getAttribute(
            "data-type"
          );
          self.activeName = "first";
          if (action == "click" && self.isSwitch) {
            let oldNode = document.getElementById("curNd");

            if (oldNode != null && oldNode.isSameNode(obj.node)) {
              return;
            }
            if (oldNode) oldNode.removeAttribute("id");
            obj.node.setAttribute("id", "curNd");

            for (var i = 0; i < types.length; i++) {
              if (types[i] !== "aunderline") {
                self.switchHCType(types[i]);
              }
            }

            self.temp_currentNode = obj.node;
            self.knowledgeParas.text = text;
            self.getKnowledgeList(3);
          } else if (action == "dbclick" && self.isSwitch) {
            if ($(obj.node).hasClass("word_temp")) {
              return;
            }
            self.knowledgeData= {};
            self.wte.cleanNode(obj.node);
            $(con_ProviewArea).html(self.wte.contents());
            self.updateDis(); //保存
          } else if (action == "select") {
            if (self.wordToken.currentCName) {
              if (text.length == 1) {
                alert("所选的词长度必须大于1!");
                self.wte.cleanNode(obj.node);
                return;
              }
              var cNmae = self.wordToken.currentCName;
              window.click_currentCname = self.wordToken.currentCName;
              var isTrue = true;
              //isTrue = isValidWord(text);
              // if (!isTrue) {
              //   alert("您所选的词包含不合法字符,请重新选择！");
              //   self.wte.cleanNode(obj.node);
              // } else {
              var aryName = [];
              aryName.push(self.wordToken.currentCName);
              self.wte.tokenNode(obj.node, aryName);
              self.temp_currentNode = obj.node;
              let oldNode = document.getElementById("curNd");
              if (oldNode) oldNode.removeAttribute("id");
              obj.node.setAttribute("id", "curNd");
              self.knowledgeParas.text = text;
              self.getKnowledgeList(1);
              //}
            } else {
              alert("请选择一种划类型！");
              self.wte.cleanNode(obj.node);
            }
          }
        }
      });
    },
    /**
     * 查询页面内容
     */
    getDataInfo(id) {
      //重写获取表单数据
      let api = this.$api; //API地址
      let paras = { canShu: JSON.stringify({ pid: id }) };
      axios
        .all([
          axios.post(api.jibingDetail, paras) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            this.dataInfo = data.body; //将用户数据复制给dataInfo
            this.loading = false;
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
  },
  updated() {
    //初始获取数据
    this.iniWte();
  }
};
</script>

<style>
.zsjc-oprate {
  color: #333;
}

.zsjc-oprate .main {
  margin-right: 30%;
  border: 1px solid #e6ebf5;
  border-width: 0 1px 0 0;
}
/*标题*/
.art-title {
  font-size: 24px;
  text-align: center;
  padding: 15px 0;
  border-bottom: 2px solid #e6ebf5;
}
.art-body {
  padding: 20px;
}
.art-body .inner-bord {
  border: 1px solid #e6ebf5;
}
/* 控制条*/
.kz-pannel {
  background-color: #f5f6f5;
  padding: 10px 20px;
}
.art-body #con_nonParticipleArea,
.art-body #con_ProviewArea {
  height: 300px;
  overflow-y: scroll;
}
/*划词/预览切换样式*/
.kz-pannel .hc-xq .current {
  color: #fff;
  background: #409eff;
}

/*划词类型按钮*/
.kz-pannel ul.class-type {
  display: inline-block;
  vertical-align: middle;
  margin-left: 50px;
}
.kz-pannel ul.class-type li {
  display: table-cell;

  font-size: 14px;
  height: 32px;
  vertical-align: middle;
  padding: 0 20px;
}
.kz-pannel ul.class-type li.current {
  border: 1px solid #e6ebf5;
  background: #fff;
}
.kz-pannel ul.class-type li i {
  font-size: 16px;
}
.main .form-footer {
  padding: 15px 0;
  text-align: center;
}
.zsjc-oprate .right-side {
  float: right;
  width: 30%;
  overflow-x: hidden;
  padding: 10px 20px;
   z-index: 99;
}
.zsjc-oprate .right-side .t-title {
  font-size: 14px;
  margin: 0 0 10px 0;
}
.zsjc-oprate .right-side .t-form {
  margin: 10px 0;
}
.zsjc-oprate .right-side .el-form-item {
  margin-bottom: 0;
}
.zsjc-oprate .right-side .words-type {
  display: inline-block;
  margin-left: 30px;
}
.zsjc-oprate .right-side .words-type button {
  width: 16px;
  height: 16px;
  border: none;
  margin: 10px;
}
.zsjc-oprate .right-side .words-type button.current {
  outline: 1px solid #333;
}
.zsjc-oprate .right-side .words-type button.jb {
  background-color: #e66000;
}
.zsjc-oprate .right-side .words-type button.yp {
  background-color: #0ad00a;
}
.zsjc-oprate .right-side .words-type button.zb {
  background-color: #ae21d9;
}
</style>
