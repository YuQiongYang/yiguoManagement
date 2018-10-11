<template>
<el-form-item label="角色" >
    <el-select @change="changeRoot(value)" v-if="value" v-model="value" :disabled = "root !== 'vip'"   placeholder="请选择">
        <el-option
        v-for="item in roles"
        :key="item.id"
        :label="item.role"
        :value="item.role">
        </el-option>
    </el-select>
</el-form-item>
</template>

<script>
export default {
  props: ["root"],
  data() {
    return {
      roles: [
        { id: 1, role: "超级管理员", root: "vip" },
        { id: 2, role: "管理员", root: "manager" },
        { id: 3, role: "会员", root: "menber" }
      ],
      value: "",
      userRoot: ""
    };
  },
  methods: {
    changeRoot(value) {
      for (let i = 0; i < this.roles.length; i++) {
        if (value == this.roles[i].role) {
          this.$emit("changeroot", this.roles[i].root);
        }
      }
    }
  },
  mounted() {
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].root === this.root) {
        this.value = this.roles[i].role;
        // console.log(this.root, this.value);
      }
    }
  }
};
</script>
