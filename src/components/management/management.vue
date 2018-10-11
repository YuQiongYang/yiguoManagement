<template>
    <div>
        <el-container class="main">
            <el-aside :width="tabWidth+'px'">
                <div>
                    <div class="isClossTab" @click="isClossTabFun">
                        <i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" ></i>
                    </div>
                    <el-menu :class="'menu' [isBlock? 'isblock' : 'isnone']"
                             :default-active= $route.fullPath
                             class="el-menu-vertical-demo"
                             @open="handleOpen"
                             @close="handleClose"
                             :collapse="isCollapse"
                             background-color="#545c64"
                             text-color="#fff"
                             active-text-color="#ffd04b"
                             :collapse-transition= "true"
                    >
                        <el-submenu v-for="obj in nav" :key="obj.id" :index= "obj.id">
                            <template slot="title">
                                <i :class="obj.icon"></i>
                                <span slot="title">{{obj.name}}</span>
                            </template>
                                <el-submenu 
                                    v-for="item in obj.lists" 
                                    :key="item.id" 
                                    :index="item.id"
                                     v-if="item.children"
                                    >
                                    <span slot="title">{{item.name}}</span>
                                    <el-menu-item
                                    v-for="kind in item.children"
                                    :key="kind.id" 
                                    :index= "'/management'+ item.path + '?sort=' + kind.name"
                                    @click= kindsData(kind.name)
                                    >{{kind.name}}</el-menu-item>
                                </el-submenu>
                                <el-menu-item v-else :index="item.path" @click="pathJump(item.path)">{{item.name}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
            </el-aside>
            <el-container>
                <el-header class="main-header">
                    易果后台管理系统
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <img src="" alt="">
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main>
                    <div>
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<style>
*{
    margin:0;
    padding: 0;
}
</style>

<style scoped lang="scss">
$header-height: 60px;
$background-color: #545c64;
$color: #fff;
 .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
.main {
  height: 100vh;
  min-width: 800px;
  min-height: 600px;
  overflow: hidden;

  aside {
    overflow: visible;
    height: 100%;
    background-color: $background-color;
    color: $color;

    .isblock{
        // display: block;
        text-indent:-9999px
    }
    .isnone{
        text-indent:111px;
    }
   
    .isClossTab {
      width: 100%;
      height: $header-height;
      cursor: pointer;
      font-size: 25px;
      text-align: center;
      line-height: $header-height;
      font-weight: bold;
      border-right: 1px solid #807c7c;
      box-sizing: border-box;
    }
    .menu {
      width: 100%;
      border-right: 0;
    }
  }

  .main-header {
    background-color: $background-color;
    color: $color;
    font-size: 26px;
    line-height: $header-height;

    .el-dropdown {
      cursor: pointer;
      float: right;
    }
    .el-dropdown-link {
      img {
        $imgMargin: (($header-height - 50)/2);
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        background-color: #fff;
        margin-top: $imgMargin;
      }
    }
  }

  .crumbs {
    margin-bottom: 20px;
  }
.el-menu{
    border-right: 0 none;
}
}
.el-menu--vertical{
    .el-menu-item-group__title{
        padding: 0;
    }

}
.el-menu-item-group__title{
    padding: 0;
}
</style>

<script>
import {mapActions} from 'vuex'

export default {
  data() {
    return {
      isCollapse: false,
      isBlock:true,
      tabWidth: 200,
      test1: 1,
      intelval: null,
      openNav:null,
      breadcrumb:[], 
      nav:[{
          id: "1",
          name:"商品管理",
          icon: "el-icon-menu",
          lists:[
              {
                  id:'1-1',
                  name: '商品分类',
                  path: '/kindLists',
                  children:[{
                      id:'1-1-1',
                      name:'fruits',
                  },{
                      id:'1-1-2',
                      name:'meat'
                  }]
              },
              {
                  id:'1-2',
                  name: '商品列表',
                  path: '/management/details'
              }
              ]  
      },{
          id: "2",
          name: "用户管理",
          icon: "el-icon-setting",
          lists: [
              {
                  id: '2-1',
                  name: '修改密码',
                  path: '/changePassword'
              },
              {
                  id: '2-2',
                  name: '资料修改',
                  path: '/changeData'
              }
          ]
      }]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    },
    isClossTabFun() {
      clearInterval(this.intelval);
      clearInterval(this.openNav)
      if (!this.isCollapse) {
        this.intelval = setInterval(() => {
          if (this.tabWidth <= 66) clearInterval(this.intelval);
          this.tabWidth -= 2;
          this.isBlock = false;  
        }, 1);
      } else {
          this.openNav = setInterval(()=>{
              if(this.tabWidth >= 200) clearInterval(this.openNav);
              this.tabWidth += 2;
            //   this.isBlock = true;
          },1)
        // this.tabWidth = 200;
      }
      this.isCollapse = !this.isCollapse;
    },
    kindsData(name){
        // console.log(name)
        this.$router.push({
            name:'kindLists',
            query:{sort: name}
        })
    },
    pathJump(path){
        // console.log(path)
        if(path === '/management/details'){
            window.localStorage.setItem('types',JSON.stringify({type:'fruits',name:'全部'}))
            this.$router.push({
                name:'details'
            })
        }else{
            this.$router.push({
                path
            })
        }
    },
    ...mapActions([
          'getKinds'
      ])
  },
  beforeMount(){
    this.getKinds()
    // this.$store.dispatch('userData')
  }
};
</script>

