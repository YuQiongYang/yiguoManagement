<template>
<div>
  <el-form :model="editGood">
    <el-form-item 
    v-for="(item,attr) in showAttr" 
      :key="item.CommodityId"  
      :label="attr" 
      :label-width="formLabelWidth">
      <el-input 
       v-model="editGood[attr]"
       autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </div>
  </div>
</template>

<script>
export default {
  props: ["dialogFormVisible", "editGood"],
  data() {
    return {
      showAttr: {
        CommodityName: "",
        MaxLimitCount: "",
        OriginalPrice: "",
        SellPrice: "",
        Spec: "",
        PromotionTag: "",
        CommodityTag: "",
        shelfDate: "",
        sales: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    cancel() {
      this.$emit("success", false);
      this.$message({
        message: "您取消了编辑",
        type: "warning"
      });
    },
    confirm() {
      this.$emit("success", false);

      // console.log(this.editGood)
      let type = JSON.parse(window.localStorage.getItem("types")).type;
      this.$http
        .post("updateGoods", {
          updateData: JSON.stringify(this.editGood),
          type
        })
        .then(res => {
          console.log(res);
          if (res.status) {
            this.$message({
              message: "您已修改成功",
              type: "success"
            });
          }else{
              this.$message({
              message: "修改失败哦",
              type: "error"
            });
          }
        });
    }
  },
  beforeMount() {
    //   console.log('子组件',this.editGood)
  }
};
</script>
