<template>
    <div class="addData">
        <span class="back" @click='$router.go(-1)'>
        <i class="el-icon-arrow-left"></i>
        <a href="javascript:">返回到列表页</a>
        </span>
    <!-- <h1>添加商品</h1> -->
    <el-form
    :model="addData"
    :rules="rules"
    ref="addData" 
    label-width="150px"
    class="demo-ruleForm">
        <el-form-item 
        v-if="key != 'shelfDate' && key != 'kind'" 
        v-for="(data,key) in addData"
        :key="key" 
        :label="key"
        :prop="key"
        required>
            <el-input v-model="addData[key]"></el-input>
        </el-form-item>

        <el-form-item 
        v-if="key === 'shelfDate'" 
        v-for="(data,key) in addData"
        :key="key" 
        :label="key" required>
            <el-col :span="11">
            <el-form-item prop="key">
                <el-date-picker value-format="yyyy-MM-dd" type="date" placeholder="选择日期" v-model="addData[key]" style="width: 100%;"></el-date-picker>
            </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item  
        v-for="(data,key) in addData"
        v-if="key === 'kind'" 
        prop="key"  
        :key="key" 
        :label="key">
            <el-radio-group v-model="addData[key]">
            <el-radio v-for="item in types" :key="item" :label="item"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('addData')">立即创建</el-button>
            <el-button @click="resetForm(addData)">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      addData: {
        CommodityId: "123",
        CommodityName: "奇异果",
        CommodityTag: "22",
        MaxLimitCount: "22",
        OriginalPrice: "22",
        PromotionTag: "22",
        SellPrice: "22",
        Spec: "买一送一",
        sales: "22",
        shelfDate: "2015/5/20",
        kind: "fruits"
      },
      types: ["fruits", "meat"],
      rules: {
        CommodityId: [
          { required: true, message: "请输入id，有且不能重复", trigger: "blur" }
        ],
        CommodityName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        CommodityTag: [
          { required: true, message: "请输入商品标记", trigger: "blur" }
        ],
        MaxLimitCount: [
          { required: true, message: "请输入最大购买数量", trigger: "blur" }
        ],
        OriginalPrice: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        PromotionTag: [
          { required: true, message: "请输入优惠信息", trigger: "blur" }
        ],
        SellPrice: [
          { required: true, message: "请输入销售价格", trigger: "blur" }
        ],
        Spec: [
          { required: true, message: "请输入商品购买单位", trigger: "blur" }
        ],
        sales: [{ required: true, message: "请输入已卖数量", trigger: "blur" }],
        shelfDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        kind: [{ required: true, message: "请选择分类", trigger: "change" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.addData);
          let type = this.addData.kind;
          console.log(this.addData, type);
          this.$http
            .post("addData", { addData: JSON.stringify(this.addData), type })
            .then(res => {
              if (!res.status && res.message === "goods is exist") {
                this.$confirm("商品已存在，是否重新添加", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    this.$message({
                      type: "warning",
                      message: "请继续填写商品详情"
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消添加商品"
                    });
                    this.$router.go(-1);
                  });
              } else if (res.status && res.data.ops.length > 0) {
                this.$message({
                  type: "success",
                  message: "已成功添加商品"
                });
                this.$router.go(-1);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      for (let key in formName) {
        formName[key] = "";
      }
      //   this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.back {
  background: #409eff;
  padding: 5px 10px;
  border-radius: 8px;
  color: #fff;
  a {
    color: #fff;
    text-decoration: none;
  }
}
form {
  margin-top: 30px;
  width: 600px;
}
</style>

