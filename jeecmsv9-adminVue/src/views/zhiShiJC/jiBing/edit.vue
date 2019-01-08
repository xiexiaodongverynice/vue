<template>
  <section class="cms-body zsjc-edit" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>
    <!-- 主工作区 -->
    <div class="main">
      <!-- 标题栏 -->
      <div class="art-title">
        {{dataInfo.fName}}
      </div>
      <div class="art-body">
        <!-- 操作控制面板 -->
        <div class="inner-bord">
          <!-- <div class="kz-pannel">
          </div> -->
          <!-- 内容操作区 -->
          <div id="con_edit">
            <div class="word_title">【概述】</div>
            <knowledge-editor :defaultMsg="dataInfo.fGaiShu" :index="0" @ready="getUeditor"></knowledge-editor>

            <div class="word_title">【临床表现】</div>
            <knowledge-editor :defaultMsg="dataInfo.fLinChuangTeDian" :index="1" @ready="getUeditor"></knowledge-editor>

            <div class="word_title">【诊断要点】</div>
            <knowledge-editor :defaultMsg="dataInfo.fZhiLiao" :index="2" @ready="getUeditor"></knowledge-editor>
          </div>

        </div>
      </div>
      <div class="form-footer">
        <el-button type="primary" v-if="dataInfo.checkStatus!=1" @click="updateContext()">提交修改</el-button>
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
      rules: {
        //校验规则
      },
      wordToken: {
        currenZiDuan: null //当前操作字段
      },
      ue: []
    };
  },
  methods: {
    getUeditor(ue, index) {
      this.ue[index] = ue; //获取ue实例
    },
    /**
     * 提交内容修改
     */
    updateContext() {
      this.loading = true;
      let nameValueList = [];
      let gsOjb = {
        columnName: "fGaiShu",
        columnValue: this.ue[0].getContent()
      };
      let lcOjb = {
        columnName: "fLinChuangTeDian",
        columnValue: this.ue[1].getContent()
      };
      let zlOjb = {
        columnName: "fZhiLiao",
        columnValue: this.ue[2].getContent()
      };
      nameValueList.push(gsOjb);
      nameValueList.push(lcOjb);
      nameValueList.push(zlOjb);

      let paras = {
        canShu: JSON.stringify({
          pid: this.id,
          nameValueList: nameValueList
        })
      };
      axios
        .all([axios.post(this.$api.updateContext, paras)])
        .then(
          axios.spread(data => {
            this.loading = false;
            this.successMessage("提交成功");
            setTimeout(() => {
              this.routerLink("list");
            }, 1000);
            
          })
        )
        .catch(err => {});
    },
    checkHtml(htmlStr) {
      var imageMath = /<img[^>]+>/;
      return imageMath.test(htmlStr);
    },
    /**
     * 查询页面内容
     */
    getDataInfo(id) {
      this.loading = true;
      //重写获取表单数据
      let api = this.$api; //API地址
      let paras = { canShu: JSON.stringify({ pid: id }) };
      axios
        .all([
          axios.post(api.jibingDetail, paras) //axios批量发送请求
        ])
        .then(
          axios.spread(data => {
            // for (var filedName in data.body) {
            //   let str = data.body[filedName];
            //   if (
            //     filedName === "fGaiShu" ||
            //     filedName === "fLinChuangTeDian" ||
            //     filedName === "fZhiLiao"
            //   ) {
            //     if (this.checkHtml(str)) {
            //       this.showUeditor[filedName] = true;
            //     }
            //   }
            // }
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
  }
};
</script>

<style>
.zsjc-edit {
  color: #333;
}

.zsjc-edit .main {
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
#con_edit {
  padding: 0 20px 20px 20px;
}
.main .form-footer {
  padding: 15px 0;
  text-align: center;
}
.zsjc-edit .word_title {
  margin: 20px 0 10px 0;
}
.edui-editor-iframeholder {
  width: 100% !important;
}
</style>
