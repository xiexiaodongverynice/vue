import axios from "axios";
export default {
    inject: ['reload'],
    data() {
        return {
            activeName: "first",
            knowledgeDetail: [],
            knowledName: null,
            knowledgeParas: {
                type: "",
                text: "",
                input: ""
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
        }
    },
    methods: {
        fanye(id) {
            this.$router.replace({ path: this.$router.path, query: { id: id } });
            // this.$router.go(0);
            this.reload();
        },
        /**
         * 详情中链接点击弹出知识详情
         */
        xqHrefClick() {
            let self = this;
            $("#con_ProviewArea a")
                .unbind("click")
                .click(function (e) {
                    let classList = e.target.classList;
                    if (classList.contains("jbmc")) {
                        self.switchHCType("jbmc");
                    } else if (classList.contains("jymc")) {
                        self.switchHCType("jymc");
                    } else if (classList.contains("ypmc_zn")) {
                        self.switchHCType("ypmc_zn");
                    } else if (classList.contains("ypmc_qt")) {
                        self.switchHCType("ypmc_qt");
                    }
                    let obj = {
                        name: e.target.innerText
                    };
                    self.getKnowledgeDetail(obj);
                    e.preventDefault();
                });

        },

        /**
         * 知识详情
         */
        getKnowledgeDetail(row) {
            this.loading = true;
            if (this.knowledName == row.name) {
                this.loading = false;
                this.dialogVisible = true;
                return;
            }
            let paras = {
                canShu: JSON.stringify({
                    type: this.wordToken.currenService,
                    name: row.name
                })
            };
            this.knowledName = row.name
            axios
                .all([axios.post(this.$api.getKnowledgeDetail, paras)])
                .then(
                    axios.spread(data => {
                        if (data.body && data.body.displayData) {
                            this.knowledgeDetail = data.body.displayData;
                        } else {
                            this.knowledgeDetail = {}
                        }

                        //console.log(data);
                        this.loading = false;
                        this.dialogVisible = true;
                    })
                )
                .catch(err => { });
        },

        /**
         * 划词列表中删除划词
         */
        wordDelete(row) {
            this.knowledgeData = {};
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
                    beanId: this.beanId,
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
                .catch(err => { });
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
            newNode.classList.remove("spanstylecss");
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
            newNode.classList.add("spanstylecss");
            newNode.classList.remove("aunderline");
            if (this.wordToken.currentCName === "ypmc_zn") {
                newNode.classList.remove("ypmc_zn");
                newNode.classList.add("ypmc_qt");
            }
            oldNode.parentNode.replaceChild(newNode, oldNode);
            $("#con_ProviewArea").html(this.wte.contents());
            newNode.setAttribute("id", "curNd");
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
        updateDis(isEdit) {
            //isEdit = arguments[0] ? arguments[0] : "false";
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
                    beanId: this.beanId,
                    // contentChangeFlag: isEdit,
                    pid: this.id,
                    ziDuan: zd,
                    disContent: disContent
                })
            };
            axios
                .all([axios.post(api.updateDis, paras)])
                .then(axios.spread(data => { }))
                .catch(err => { });
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
                .catch(err => { });
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
                editable: true,
                dom: $(con_nonParticipleArea),
                block: "word_content",
                disableColor: "#aaa",
                text: text,
                callback: function (obj) {
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
                        self.knowledgeData = {};
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
                    } else if (action == "edit") {
                        self.wordToken.currenZiDuan = obj.node.getAttribute(
                            "data-type"
                        );
                        $(con_ProviewArea).html(self.wte.contents());
                        self.updateDis("true"); //保存

                    }
                }
            });
        }
    }
}