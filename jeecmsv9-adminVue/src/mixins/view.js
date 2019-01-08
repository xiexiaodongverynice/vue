import axios from "axios";
export default {
    data() {
        return {
            loading: true,//遮罩
            id: this.$route.query.id,//id
            type: this.$route.query.type,//操作类型
            dataInfo: {},//基础表单信息,
            dataInfos:{},
            form: this.$refs['form'],//
            disabled: true, //禁用状态
            ids: "", //多选id
            tableData: [], //表格数据
            total: 0, //列表总数
            listUrl:'',//列表地址,
            params:{},
            checkedList:[],//选中的对象
            state:false,
        }
    },
    methods: {
        /**
         * 获取数据方法
         * @param {number} id 
         * @param {object} obj 
         */
        getviewData(url,params) {//获取表格数据   
            this.params=params;
            this.listUrl=url;
            this.loading = true;
            this.$http
                .post( this.listUrl,this.params)
                .then(res => {
                    this.loading = false;
                    if(res.code=='200'){
                        this.dataInfo = res.body.zb;
                        this.tableData = res.body.cbList;
                        this.dataInfos = res.body.cb
                    }else{
                        this.dataInfo={};
                        this.tableData = [];
                        this.dataInfos = {};
                    }
                   
                   
                })
                .catch(error => {
                    this.loading = false;
                });
        },
        checkIds(val) {
            
            let ids = [];
            for (let i in val) {
                if(val[i].id)
                {
                    ids.push(val[i].id);
                }
                else
                {
                    ids.push(val[i].pid);
                }
                
            }
            this.ids = ids.join(",");
            this.disabled = val.length > 0 ? false : true;
            this.checkedList=val;
        },
        deleteBatch(url,ids,user) { //删除
            this.$confirm('是否确定删除？', '警告', { type: "error" })
                .then(mes => {
                    let params={canShu:JSON.stringify({ ids: ids,user:user})}
                    this.$http.post(url, params).then(res => {
                        if (res.code == "200") {
                            this.successMessage('删除成功');
                            this.getviewData(this.listUrl,this.params);
                        }
                    });
                })
                .catch(error => { });
        },
       
    }

}