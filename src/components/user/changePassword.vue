<template>
<div class="changePassword">
    <h4>修改密码</h4>
    <hr>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="当前密码" prop="oldPassword">
            <el-input v-model="ruleForm2.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2',ruleForm2)">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
    </el-form>
</div>
    
</template>

<script>
export default {
  data() {
    var checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        oldPassword: ""
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: "blur" },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: "请输入6-16位数字和字母的组合"
          }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPassword: [{ validator: checkOldPassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName, form) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(window.localStorage.getItem("user"));
          let data = {
            username: window.localStorage.getItem("user"),
            password: form.checkPass,
            oldPassword: form.oldPassword
          };
          this.$http
            .post("changePassword", {
              changePassword: JSON.stringify(data)
            })
            .then(res => {
              console.log(res);
              if (!res.status && res.message == "当前密码错误") {
                this.$message.error("当前密码错误，请确认后重新输入");
              } else if (res.status && res.data.n) {
                this.$message({
                  message: "密码修改成功，请重新登录",
                  type: "success"
                });
                this.$router.push({
                    name:'login'
                })
              }
            });
        } else {
          this.$message.error("验证失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    // this.$store.dispatch('userData')
  }
};
</script>

<style lang="scss" scoped>
h4 {
  margin-bottom: 10px;
}
hr {
  margin-bottom: 30px;
}
form {
  width: 450px;
}
</style>
