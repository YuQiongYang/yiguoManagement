<template>
<div>
   <el-table
    v-for="(kind,i) in allKinds" 
    :key="i"
    v-if="kind != null"
    :data="kind"
    style="width: 600px">
     <el-table-column
      type="index"
      width="100">
     </el-table-column>
    <el-table-column
      label="分类"
      width="180">
      <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.name}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row.name)">进入分类</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>

</template>

<script>
export default {
  computed: {
    allKinds() {
      return this.$store.state.kinds.allKinds.map(item => {
        delete item._id;
        if (Object.keys(item).indexOf(this.$route.query.sort) > -1) {
          let key = Object.keys(item)[0];
          return item[key];
        }
      });
    }
  },
  methods:{
    handleEdit(i,name){
      console.log(this.$route.query.sort,name)
      let keys = {type:this.$route.query.sort,name:name}
      window.localStorage.clear('types');
      window.localStorage.setItem('types',JSON.stringify(keys))
      this.$router.push({
        name:'details'
      })
    }
  },
  created() {
    // this.$store.dispatch('userData')
  }
};
</script>
