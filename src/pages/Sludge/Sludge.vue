<template>
  <d2-container>
 <template>
<el-row>
  <el-input
    placeholder="地址、编号、名称"
    prefix-icon="el-icon-search"
    v-model="input21"  style="height:40px;width:500px;padding-right: 5px;">
  </el-input>
  <el-button icon="el-icon-search" style="position: absolute;" @click="search()">搜索</el-button>
</el-row>
    <el-table
      :data="tableData"
      style="width: 100%"  v-loading="loading">
         <el-table-column type="expand">
            <template slot-scope="scope">
              <div >
                <a v-for="item in scope.row.attachmentList" :href="item.imgUrl" target="_blank">
                  <img :src="item.imgUrl" title="查看原图" width="100" height="100" class='img'>
                </a>
              </div>
                <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="地址">
            <span>{{ scope.row.userAddress }}</span>
          </el-form-item>
          <el-form-item label="用户编号">
            <span>{{ scope.row.userCode }}</span>
          </el-form-item>
          <el-form-item label="用户名称">
            <span>{{ scope.row.userName }}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span>{{ scope.row.userPhone }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{ scope.row.remark }}</span>
          </el-form-item>
          
        </el-form>
          </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="180" :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        prop="sludgeCode"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sludgeName"
        label="名称">
      </el-table-column>
       <el-table-column
        prop="typeName"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="genreName"
        label="类别">
      </el-table-column>
      <el-table-column
        prop="caliber"
        label="口径">
      </el-table-column>
       <el-table-column label="编辑">
      <template slot-scope="scope">
        <el-button class="fa fa-edit"
          @click="handleEdit(scope.$index, scope.row.sludgeId,scope.row.attachmentList)"></el-button>
      </template>
    </el-table-column>
    </el-table>
      <el-pagination class='button' background layout="prev, pager, next" :page-size=parseInt(this.pageSize) :total="totalCount" @current-change="handleCurrentChange">
</el-pagination>
  </template>
  <el-dialog title="" :visible.sync="dialogFormVisible">

  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
<el-collapse v-model="activeName" accordion>
  <el-collapse-item title="排泥信息" name="1">
     <el-form-item label="ID" prop="sludgeId">
    <el-input v-model="ruleForm.sludgeId" disabled></el-input>
  </el-form-item>
    <el-form-item label="编号" prop="sludgeCode">
    <el-input v-model="ruleForm.sludgeCode"></el-input>
  </el-form-item>
    <el-form-item label="名称" prop="sludgeName">
    <el-input v-model="ruleForm.sludgeName"></el-input>
  </el-form-item>
     <el-form-item label="面积" prop="acreage">
    <el-input v-model="ruleForm.acreage"></el-input>
  </el-form-item>
      <el-form-item label="口径" prop="caliber">
    <el-input v-model="ruleForm.caliber"></el-input>
  </el-form-item>
    <el-form-item label="类型" prop="typeId">
    <el-select v-model="ruleForm.typeId" placeholder="请选择类别" >
       <el-option
      v-for="item in typeList"
      :key="item.typeId"
      :label="item.typeName"
      :value="item.typeId">
    </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="类别" prop="genreId">
    <el-select v-model="ruleForm.genreId" placeholder="请选择类型" >
       <el-option
      v-for="item in options"
      :key="item.genreId"
      :label="item.genreName"
      :value="item.genreId">
    </el-option>
    </el-select>
  </el-form-item>
  </el-collapse-item>
  <el-collapse-item title="用户信息" name="2">
     <el-form-item label="用户地址" prop="userAddress">
    <el-input v-model="userInfo.userAddress"></el-input>
  </el-form-item>
  <el-form-item label="用户编号" prop="userCode">
    <el-input v-model="userInfo.userCode"></el-input>
  </el-form-item>
  <el-form-item label="用户名称" prop="userName">
    <el-input v-model="userInfo.userName"></el-input>
  </el-form-item>
  <el-form-item label="联系电话" prop="userPhone">
    <el-input v-model="userInfo.userPhone"></el-input>
  </el-form-item>
  <el-form-item label="备注" prop="remark">
    <el-input v-model="userInfo.remark"></el-input>
  </el-form-item>
  </el-collapse-item>
 
</el-collapse>
  <el-form-item class='button'>
    <el-button type="primary" @click="submitForm('ruleForm')">{{button}}</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</el-dialog>
  </d2-container>
</template>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.img {
  padding-right: 5px;
}
.button{
  margin-top:10px
}
</style>
<script>
import moment from "moment";
export default {
  // 如果需要缓存页面
  // name 字段需要设置为和本页路由 name 字段一致
  name: "Sludge",
components: {},
 data() {
    return {
      button: "",
      tableData: [],
      totalCount: 0,
      loading: true,
      dialogFormVisible: false,
      isdisabledFn: true,
      ruleForm: {
        sludgeId: 0,
        sludgeCode: "",
        sludgeName: "",
        acreage: "",
        caliber: "",
        lat: 0,
        lon: 0,
        typeId: 0,
        genreId: 0
      },
      rules: {},
      options: [],
      typeList: [],
      attachmentList: [],
      userInfo: {},
      activeName: "1",
      input21: ""
    };
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    search() {
      if (this.input21 === "") {
        this.$message.error("请输入检索条件");
      } else {
        this.querytable(1, this.input21);
      }
    },
    handleEdit(index, row, attachmentList) {
      this.button = "保存";

      this.$post(this.genre + "queryList", { PageSize: 100, PageIndex: 0 })
        .then(res => {
          this.options = res.json.list;
        })
        .catch(err => {
          console.warn(err);
        });
      this.$post(this.type + "queryList", { PageSize: 100, PageIndex: 0 })
        .then(res => {
          this.typeList = res.json.list;
        })
        .catch(err => {});

      this.$post(this.sludge + "queryInfo", { Id: row })
        .then(res => {
          this.ruleForm = res.json;
          this.dialogFormVisible = true;
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      this.$post(this.att + "queryList", { Id: row })
        .then(res => {
          res.json.map((v, i) => {
            this.attachmentList.push(v);
          });
          console.log(this.attachmentList);
        })
        .catch(err => {});
      this.$post(this.user + "queryInfo", { Id: row })
        .then(res => {
          this.userInfo = res.json[0];
        })
        .catch(err => {});
    },
    resetForm() {
      this.$post(this.sludge + "queryInfo", { Id: this.ruleForm.sludgeId })
        .then(res => {
          this.ruleForm = res.json;
          this.dialogFormVisible = true;
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    querytable(pageIndex,address='') {
      this.loading = true;
      this.$post(this.sludge + "queryList", {
        PageSize: this.pageSize,
        PageIndex: parseInt(pageIndex) - 1,
        Address: address
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
    handleCurrentChange(val) {
      this.querytable(val);
      console.log(`当前页: ${val}`);
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let sludge = {
            sludge: this.ruleForm,
            list: this.attachmentList,
            user: this.userInfo
          };
          console.log(sludge);
          this.$post(this.sludge + "update", sludge)
            .then(res => {
              if (res.msg === "") {
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.msg);
              }
              this.querytable(1);
            })
            .catch(err => {
              this.$message.error("错了哦");
              console.error(err);
            });
        }
      });
    }
  },
  mounted: function() {
    this.querytable(1);
  }
};
</script>

