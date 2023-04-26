<template>
  <div style="width: 100%">
    <div class="control-box">
      <el-input
        clearable
        v-model="searchForm.cardPrice"
        placeholder="请输入卡价格"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.buffMinSellNum"
        placeholder="buff在售数量大于"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.buffMaxSellNum"
        placeholder="buff在售数量小于"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.steamBuyPriceMin"
        placeholder="steam求购价格大于"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.steamBuyPriceMax"
        placeholder="steam求购价格小于"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.itemNameInclude"
        placeholder="饰品名字包含"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.itemNameExclude"
        placeholder="饰品名字不包含"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.profitRateMin"
        placeholder="利润率大于"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-input
        clearable
        v-model="searchForm.profitRateMax"
        placeholder="利润率小于"
        class="control-input"
        @keyup.enter.native="initData"
      ></el-input>
      <el-button type="success" @click="initData" style="margin-left: 16px">搜索</el-button>
      <el-button type="primary" @click="handleAddAttribute"  style="margin-left: 16px">新增属性</el-button>
    </div>
    <el-table border style="width: 100%" :height="tableHeight" :data="list">
      <el-table-column prop='name' label="饰品名" align="center"></el-table-column>
      <el-table-column prop="buff_sell_num" label="buff在售数量" align="center"></el-table-column>
      <el-table-column prop="buff_sell_min_price" label="buff在售价格" align="center"></el-table-column>
      <el-table-column prop="steam_buy_max_price" label="steam求购价格" align="center"></el-table-column>
      <el-table-column prop="steam_sell_min_price" label="steam在售价格" align="center"></el-table-column>
      <el-table-column prop="projectedProfit" label="预计利润" align="center">
        <template #default="scope">
          {{renderProjectedProfit(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column prop="profit_rate" label="预计利润率" width="150" align="center">
        <template #default="scope">
          {{profitRate(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column prop="time" label="更新时间" width="170" align="center">
        <template #default="scope">
          {{renderTime(scope.row)}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script setup>
  import {reactive,toRefs,onBeforeUnmount,onMounted,getCurrentInstance} from 'vue'
  const { proxy } = getCurrentInstance()
  const { $axios } = proxy
  const _data = reactive({
    tableHeight: "588px",
    list:[],
    searchForm:{
      cardPrice: 500,
      buffMinSellNum: "",
      buffMaxSellNum: "",
      steamBuyPriceMin: "",
      steamBuyPriceMax: "",
      itemNameInclude:"",
      itemNameExclude:"",
      profitRateMin: "",
      profitRateMax: ""
    },
    pageNum: 1,
    pageSize:20,
    total:0,
    formDetail:{},
    attributeDialogVisible: false,
    attributeDialogType: 'add',
    /*操作记录弹窗属性*/
    operationDialogVisible:false,
    operationData:[],
  });
  function initData(){
    console.log(_data.searchForm)
    const searchForm = {..._data.searchForm,page:_data.pageNum,pageSize:_data.pageSize}
    $axios.post(
      `/api/steamInfo/selectItem`,
      {...searchForm},
    ).then(res=>{
        _data.list = res.itemList
        _data.total = res.itemCount
    })
  };

  onMounted(()=>{
    initData()
  });


  function handleSizeChange(e){
    _data.pageSize = e
    _data.pageNum = 1
    initData()
  };

  function handleCurrentChange(e){
    _data.pageNum = e
    
    initData()
  };

  function renderProjectedProfit(row){
    return row.buff_sell_min_price - (row.steam_buy_max_price * (_data.searchForm.cardPrice/100))
  }

  function profitRate(row){
    return (row.profit_rate * 100).toFixed(2) + '%'
  }
  function renderTime(row){
    var time= new Date(row.time);
    var newTime=time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    return newTime
  }

  function handleResize() {
    _data.tableHeight = document.documentElement.clientHeight - 230 + "px";
  };
  window.addEventListener("resize", handleResize);
  handleResize();

  onBeforeUnmount(()=>{
    window.removeEventListener("resize", handleResize);
  });

  const {searchForm, tableHeight,pageNum,pageSize,total,formDetail,attributeDialogVisible,attributeDialogType,list,operationDialogVisible,operationData} = toRefs(_data)
</script>
<style lang="less" scoped>
.control-box {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.control-input {
    width: 200px;
    margin-left: 16px;
    margin-bottom: 10px;
}
.pagination{
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>