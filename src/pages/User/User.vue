<template>
  <d2-container  v-loading="loading">
    <el-row>
  <el-button @click="addUser()"  class="fa fa-user-plus"></el-button>
</el-row>
    <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="登录名"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.loginName }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="用户名"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.userName }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="部门"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.depName }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="手机号"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.phoneNumber }}</span>
      </template>
    </el-table-column>
     <el-table-column
      label="状态"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.status==1?'启用':'禁用' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button  class="fa fa-edit" size="mini" @click="handleEdit(scope.$index, scope.row.userId)"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination background layout="prev, pager, next" :page-size=parseInt(this.pageSize) :total="totalCount" @current-change="handleCurrentChange">
</el-pagination>

<el-dialog title="" :visible.sync="dialogFormVisible">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="登录名" prop="loginName">
    <el-input v-model="ruleForm.loginName"></el-input>
  </el-form-item>
   <el-form-item label="用户名" prop="userName">
    <el-input v-model="ruleForm.userName"></el-input>
  </el-form-item>
    <el-form-item label="手机号" prop="phoneNumber">
    <el-input v-model="ruleForm.phoneNumber"></el-input>
  </el-form-item>
  <el-form-item label="部门" prop="depId">
    <el-select v-model="ruleForm.depId" placeholder="请选择部门" >
       <el-option
      v-for="item in options"
      :key="item.depId"
      :label="item.depName"
      :value="item.depId">
    </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="状态" prop="status">
    <el-switch active-text="启用"
  inactive-text="禁用" v-model="ruleForm.status"></el-switch>
  </el-form-item>

   <el-form-item>  
     <el-tag type="danger">默认密码:{{this.initPassWord}}</el-tag>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">{{button}}</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
     <el-button type="warning"  :disabled="isdisabledFn" @click="resetPassword();">重置密码为默认密码</el-button>
  </el-form-item>
</el-form>
</el-dialog>
  </d2-container>
</template>

<script>
import util from "@/libs/util.js";

export default {
  // 如果需要缓存页面
  // name 字段需要设置为和本页路由 name 字段一致
  name: "User",
  components: {},
  data() {
    return {
      button: "",
      options: [],
      tableData: [],
      totalCount: 0,
      loading: true,
      dialogFormVisible: false,
      isdisabledFn: true,
      ruleForm: {
        userId: 0,
        userName: "",
        phoneNumber: "",
        status: false,
        loginName: "",
        password: ""
      },
      rules: {
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在11个字符", trigger: "blur" }
        ],
        region: [{ required: true, message: "请选择部门", trigger: "change" }]
      }
    };
  },
  methods: {
    querytable(pageIndex) {
      this.loading = true;
      this.$post(this.account + "queryUserList", {
        PageSize: this.pageSize,
        PageIndex: parseInt(pageIndex) - 1
      })
        .then(res => {
          this.tableData = res.json.list;
          this.totalCount = parseInt(res.json.totalCount);
          this.loading = false;
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    queryDepartment() {
      this.$fetch(this.department + "queryList")
        .then(res => {
          this.options = res.json;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEdit(index, row) {
      this.button = "保存";
      this.queryDepartment();
      this.$fetch(this.account + "queryUserInfo?id=" + row)
        .then(res => {
          this.ruleForm = res.json;
          this.ruleForm.status = res.json.status == 1 ? true : false;
          this.loading = false;
          this.dialogFormVisible = true;
          this.isdisabledFn = false;
        })
        .catch(err => {
          //console.log(err)
        });
      this.userId = row;
      //console.log(index, row);
    },
    addUser() {
      this.ruleForm = {};
      this.button = "立即创建";
      this.queryDepartment();
      this.dialogFormVisible = true;
    },
    handleCurrentChange(val) {
      this.querytable(val);
      console.log(`当前页: ${val}`);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "updateUser";
          let m = {};
          if (this.button === "立即创建") {
            url = "register";
            m.Mobile = this.ruleForm.phoneNumber;
            m.Password = this.initPassWord;
            m.LoginName = this.ruleForm.loginName;
            m.UserName = this.ruleForm.userName;
            m.DepId = this.ruleForm.DepId;
            m.Status = this.ruleForm.status;
          } else {
            this.ruleForm.status = this.ruleForm.status ? 1 : 0;
            m = this.ruleForm;
          }
          this.$post(this.account + url, m)
            .then(res => {
              if (res.msg === "") {
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.msg);
              }
              querytable(1);
              console.log(res);
            })
            .catch(err => {
              this.$message.error("错了哦");
              console.log(err);
            });
        } else {
          this.$message.error("error submit!!");
          console.log("error submit!!");
          return false;
        }
        this.ruleForm.status = this.ruleForm.status == 1 ? true : false;
      });
    },
    resetForm(formName) {
      this.ruleForm = {};
    },
    resetPassword() {
      this.$post(this.account + "resetPassword", {
        UserId: this.ruleForm.userId,
        Password: this.initPassWord
      })
        .then(res => {
          this.$message({
            message: "更新成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message.error("错了哦");
        });
      //console.log(this.ruleForm)
    }
  },
  mounted: function() {
    this.querytable(1);
  }
};
</script>
