<template>
  <d2-container>
    <el-button @click="addUser()"  class="fa fa-plus-square"></el-button>
        <el-table
      :data="tableData"
      style="width: 100%" v-loading="loading">
      <el-table-column prop="depId" label="ID" width="180">
      </el-table-column>
      <el-table-column
        prop="depName"
        label="名称"
        width="180">
      </el-table-column>
       <el-table-column
        prop="create"
        label="创建人"
        width="180">
      </el-table-column>
        <el-table-column
      label="状态"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.status==1?'启用':'禁用' }}</span>
      </template>
    </el-table-column> 
      <el-table-column label="禁用">
      <template slot-scope="scope">
        <el-button  class="fa fa-close" size="mini" @click="handleEdit(scope.$index, scope.row.depId,0, scope.row.depName)"></el-button>
      </template>
    </el-table-column>
      <el-table-column label="启用">
      <template slot-scope="scope">
         <el-button  class="fa fa-check" size="mini" @click="handleEdit(scope.$index, scope.row.depId,1,scope.row.depName)"></el-button>
      </template>
    </el-table-column>
    </el-table>
    
    
<el-dialog title="" :visible.sync="dialogFormVisible">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="部门名称" prop="depName">
    <el-input v-model="ruleForm.depName"></el-input>
  </el-form-item>
  <el-form-item label="状态" prop="status">
    <el-switch active-text="启用"
  inactive-text="禁用" v-model="ruleForm.status"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">{{button}}</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</el-dialog>
  </d2-container>
</template>
<script>

import axios from 'axios';
import qs from 'qs';
export default {
  // 如果需要缓存页面
  // name 字段需要设置为和本页路由 name 字段一致
  name: "department",
  components: {},
  data() {
    return {
      button: "立即创建",
      options: [],
      tableData: [],
      totalCount: 0,
      loading: true,
      dialogFormVisible: false,
      ruleForm: {
        depId: 0,
        status: false,
        depName: ""
      },
      rules: {
        depName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    querytable() {
      this.loading = true;
      this.$fetch(this.department + "queryList")
        .then(res => {
          this.tableData = res.json;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    addUser() {
      this.ruleForm = {};
      this.button = "立即创建";
      this.dialogFormVisible = true;
    },
    handleEdit(index, depId, status, depName) {
      this.$post(this.department + "update",{
        depId: depId,
        Status: status,
        DepName: depName
      })
        .then(res => {
          console.log(res);
          if (res.msg === "") {
            this.$message({
              message: "更新成功",
              type: "success"
            });
          } else {
            this.$message.error(res.msg);
          }
          this.querytable();
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "update";
          let m = {
            DepName: this.ruleForm.depName,
            Status: this.ruleForm.status ? 1 : 0
          };
          if (this.button === "立即创建") {
            url = "add";
          } else {
            m.depId = this.ruleForm.depId;
          }
          this.$post(this.department + url, m)
            .then(res => {
              if (res.msg === "") {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.msg);
              }
              this.querytable();
              //console.log(res);
            })
            .catch(err => {
              this.$message.error("错了哦");
              console.log(err);
            });
        }
      });
    },
    resetForm(formName) {
      this.ruleForm = {};
      //this.$refs[formName].resetFields();
    }
  },
  mounted: function() {
    this.querytable();
  }
};
</script>
