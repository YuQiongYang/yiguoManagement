<template>
<div>
  <div class="search">
    关键字：
      <el-autocomplete
      class="inline-input"
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入关键字"
      @select="handleSelect"
    ></el-autocomplete>
    <a @click="search" href="javascript:"><i class="el-icon-search"></i></a> &nbsp;&nbsp;&nbsp;
    <a class="back" @click="getData" href="javascript:"> <i class="el-icon-back"></i> 返回</a>
  </div>
  <el-row>
    <el-button type="primary" @click="addData">添加产品</el-button>
    <el-button @click="deleteSelect" type="danger">删除已勾选</el-button>
  </el-row>
  <el-table
    ref="multipleTable"
    :data="goodsLists"
    tooltip-effect="dark"
    style="width: 100%"
    max-height="440"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="60"
       fixed>
    </el-table-column>
    <el-table-column
     v-for="(list,key) in goodsLists[0]"
     :key="list.CommodityId"
      :prop="key"
      :label="key"
      show-overflow-tooltip
     >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="150">
       <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="handleEdit(scope.$index, scope.row); dialogFormVisible = true"></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="handleDelete(scope.$index, scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="编辑商品" :visible.sync="dialogFormVisible">
  <diaLog 
  :dialogFormVisible= "dialogFormVisible" 
  :editGood= "editGood"  
  @success="success"></diaLog>
  </el-dialog>
  <!-- <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div> -->
</div>
</template>

<script>
import diaLog from "./dialog.vue";

export default {
  components: {
    diaLog: diaLog
  },
  data() {
    return {
      types: null,
      goodsLists: [],
      editGood: {},
      multipleSelection: [],
      currentPage4: 4,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      state: "",
      timeout: null,
      dialogFormVisible: false,
      searchData: [],
      searchName: "",
      loading: true
    };
  },
  methods: {
    success(res) {
      this.dialogFormVisible = res;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteSelect() {
      // console.log(this.multipleSelection)
      let selectData = [];
      for (let key of this.multipleSelection) {
        selectData.push({
          _id: key._id
        });
      }
      this.$confirm("是否删除选中商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("deleteData", {
              selectData: JSON.stringify(selectData),
              type: JSON.parse(window.localStorage.getItem("types")).type
            })
            .then(res => {
              if (res.status) {
                this.getData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // console.log(this.multipleSelection);
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.editGood = row;
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("是否删除此商品", "注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(666, row);
          this.$http
            .post("deleteData", {
              id: row._id,
              type: JSON.parse(window.localStorage.getItem("types")).type
            })
            .then(res => {
              if (res.status) {
                this.getData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    querySearchAsync(queryString, cb) {
      this.searchData = [];
      for (let i = 0; i < this.goodsLists.length; i++) {
        this.searchData.push({
          value: this.goodsLists[i].CommodityName,
          label: this.goodsLists[i].CommodityId
        });
      }
      var goodsLists = this.searchData;
      var results = queryString
        ? goodsLists.filter(this.createStateFilter(queryString))
        : goodsLists;
      // 调用 callback 返回建议列表的数据
      // console.log(results);
      cb(results);
    },
    createStateFilter(queryString) {
      return lists => {
        return (
          lists.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      this.searchName = item.value;
    },
    search() {
      if (this.searchName) {
        let types = JSON.parse(window.localStorage.getItem("types"));
        this.$http
          .post("findData", { searchName: this.searchName, type: types.type })
          .then(res => {
            if (res.status) {
              this.$message({
                type: "success",
                message: "您成功找到" + res.data.length + "条数据"
              });
              this.goodsLists = res.data;
            }
          });
      } else {
        this.$message({
          type: "error",
          message: "您还没选择商品哦！"
        });
      }
    },
    addData() {
      this.$router.push({
        name: "addData"
      });
    },
    getData() {
      this.goodsLists = [];
      if (window.localStorage.getItem("types")) {
        this.types = JSON.parse(window.localStorage.getItem("types"));
      } else {
        this.types = null;
      }
      // console.log(this.types);
      this.loading = true;

      if (this.types.type === "fruits") {
        this.$http.post("fruitsDatas").then(res => {
          if (res.status) {
            if (this.types.name === "全部") {
              this.goodsLists = res.data;
              this.loading = false;
            } else {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].CommodityName.indexOf(this.types.name) > -1) {
                  this.goodsLists.push(res.data[i]);
                }
              }
              this.loading = false;
            }
          }
          // this.loading = true;

          // console.log('fruits',this.goodsLists)
        });
      } else if (this.types.type === "meat") {
        this.loading = true;
        this.$http.post("meatDatas").then(res => {
          if (res.status) {
            this.loading = false;
            if (this.types.name === "全部") {
              this.goodsLists = res.data;
              this.loading = false;
            } else {
              for (let i = 0; i < res.data.length; i++) {
                if (
                  String(res.data[i].CommodityTag) == this.types.name ||
                  this.types.name.indexOf(res.data[i].CommodityName) > -1
                ) {
                  this.goodsLists.push(res.data[i]);
                }
              }
              this.loading = false;
            }
          }
          // this.loading = true;
          // console.log("meat", this.goodsLists);
        });
      }
    }
  },
  beforeMount() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 10px;
  padding-bottom: 30px;
  border-bottom: 1px solid #ccc;
}
.back {
  text-decoration: none;
  background: #409eff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 10px;
}
</style>
