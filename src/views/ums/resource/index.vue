<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="资源名称：">
            <el-input v-model="listQuery.nameKeyword" class="input-width" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径：">
            <el-input v-model="listQuery.urlKeyword" class="input-width" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类：">
            <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="input-width">
              <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
      <el-button size="mini" class="btn-add" @click="handleShowCategory()">资源分类</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="resourceTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="一级资源名称" align="center" v-if="parentIsShow">
          <template slot-scope="scope">{{ scope.row.parentName }}</template>
        </el-table-column>
        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="资源路径" align="center">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{ scope.row.desc }}</template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center" >
          <template slot-scope="scope">
            <el-button size="mini" type="text" :disabled="scope.row.parentId | disableNextLevel" @click="handleShowNextLevel(scope.$index, scope.row)">查看下级 </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑 </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑资源' : '添加资源'" :visible.sync="dialogVisible">
      <el-form :model="resource" ref="resourceForm" size="small">
        <el-form-item label="资源名称：">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径：">
          <el-input v-model="resource.url"></el-input>
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select v-model="resource.categoryId" placeholder="全部" clearable>
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="resource.desc" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createResource, updateResource, deleteResource } from '@/api/resource'
import { listAllCate } from '@/api/resourceCategory'
import { formatDate } from '@/utils/date'

const defaultListQuery = {
  page: 1,
  pageSize: 10,
  nameKeyword: '',
  urlKeyword: '',
  categoryId: '',
  parentId: 0
}
const defaultResource = {
  id: '',
  name: '',
  url: '',
  categoryId: '',
  description: ''
}
export default {
  name: 'resourceList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      resource: Object.assign({}, defaultResource),
      isEdit: false,
      categoryOptions: [],
      defaultCategoryId: null,
      parentIsShow: false,
      childIsShow: false
    }
  },
  created() {
    this.resetParentId()
    this.getList()
    this.getCateList()
    this.changeParentIsShow()
    this.changeChildIsShow()
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.getList()
      this.getCateList()
      this.changeParentIsShow()
      this.changeChildIsShow()
    }
  },
  methods: {
    changeParentIsShow() {
      if (this.listQuery.parentId === 0) {
        this.parentIsShow = false
        return true
      } else {
        this.parentIsShow = true
        return false
      }
    },
    changeChildIsShow() {
      if (this.listQuery.parentId === 0) {
        this.childIsShow = true
      } else {
        this.childIsShow = false
      }
    },
    resetParentId() {
      this.listQuery.page = 1
      if (this.$route.query.parentId != null) {
        this.listQuery.parentId = this.$route.query.parentId
      } else {
        this.listQuery.parentId = 0
      }
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.resource = Object.assign({}, defaultResource)
      this.resource.categoryId = this.defaultCategoryId
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.resource = Object.assign({}, row)
      this.resource.categoryId = this.defaultCategoryId
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateResource(this.resource.id, this.resource).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        } else {
          createResource(this.resource).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    handleShowNextLevel(index, row) {
      this.$router.push({ path: '/ums/resource', query: { parentId: row.id } })
    },
    handleShowCategory() {
      this.$router.push({ path: '/ums/resourceCategory' })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery)
        .then(response => {
          this.listLoading = false
          this.list = response.data.pagingList.resultList
          this.total = response.data.pagingList.totalRecord
        })
        .catch(e => {})
    },
    getCateList() {
      listAllCate()
        .then(response => {
          let cateList = response.data.categoryList
          for (let i = 0; i < cateList.length; i++) {
            let cate = cateList[i]
            this.categoryOptions.push({ label: cate.name, value: cate.id })
          }
          this.defaultCategoryId = cateList[0].id
        })
        .catch(e => {})
    }
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style></style>
