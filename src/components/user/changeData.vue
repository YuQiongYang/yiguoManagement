<template>
    <div class="changeData">
        <h4>设置我的资料</h4>
        <hr>
    <el-form :model="ruleForm" v-if="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <role @changeroot = "changeroot" :root="ruleForm.root" ref="childRoot"></role>
        <el-form-item label="用户名" prop="username">
            <el-input disabled v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
            <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
            <el-input v-model="ruleForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
import role from "./role.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    role: role
  },
  computed: mapState({
    userData: state => state.kinds.userData
  }),
  data() {
    return {
      ruleForm: {
        role: "",
        username: "",
        nickname: "",
        sex: "",
        phone: "",
        mail: "",
        delivery: false,
        type: [],
        desc: ""
      },
      root: "",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        mail: [
          { message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  methods: {
    changeroot(value) {
      this.ruleForm.root = value
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            console.log(this.ruleForm)
          this.$http
            .post("changeData", { changeData: JSON.stringify(this.ruleForm) })
            .then(res => {
              console.log(res);
              if (res.status) {
                this.$message({
                  message: "修改信息成功",
                  type: "success"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    let username = window.localStorage.getItem("user")
      ? window.localStorage.getItem("user")
      : "";
    if (username) {
      this.$http
        .post("userData", {
          username
        })
        .then(res => {
          this.ruleForm = res.data[0];
          delete this.ruleForm._id;
          this.root = res.data[0].root;
        });
    }
  },
  mounted() {
    this.ruleForm = this.userData[0];
    // this.$store.dispatch('userData')
  }
};
</script>

<style lang="scss" scoped>
.changeData {
  h4 {
    margin-bottom: 10px;
  }
  hr {
    margin-bottom: 20px;
  }
  form {
    width: 450px;
  }
}
</style>
