<template>
    <div>
      <stock-form></stock-form>
      <stock-table></stock-table>
      <router-view></router-view>
    </div>
</template>

<script>
import StockForm from './StockForm.vue'
import StockTable from './StockTable.vue'

export default {
  components: { StockForm, StockTable },
}
</script>