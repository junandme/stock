<template>
    <div>
        <b-container fluid="fluid">
            <!-- User Interface controls -->
            <b-row>
                <b-col lg="6" class="my-1">
                    <b-form-group
                        label="Filter"
                        label-for="filter-input"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0">
                        <b-input-group size="sm">
                            <b-form-input
                                id="filter-input"
                                v-model="filter"
                                type="search"
                                placeholder="Type to Search"></b-form-input>

                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                    <b-form-group
                        v-model="sortDirection"
                        label="Filter On"
                        description="Leave all unchecked to filter on all data"
                        label-cols-sm="3"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0"
                        v-slot="{ ariaDescribedby }">
                        <b-form-checkbox-group
                            v-model="filterOn"
                            :aria-describedby="ariaDescribedby"
                            class="mt-1">
                            <b-form-checkbox value="category">category</b-form-checkbox>
                            <b-form-checkbox value="ticker">ticker</b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-col>

                <b-col sm="5" md="6" class="my-1">
                    <b-form-group
                        label="Per page"
                        label-for="per-page-select"
                        label-cols-sm="6"
                        label-cols-md="4"
                        label-cols-lg="3"
                        label-align-sm="right"
                        label-size="sm"
                        class="mb-0">
                        <b-form-select
                            id="per-page-select"
                            v-model="perPage"
                            :options="pageOptions"
                            size="sm"></b-form-select>
                    </b-form-group>
                </b-col>

                <b-col sm="7" md="6" class="my-1">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"></b-pagination>
                </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
                :items="stocks"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                stacked="md"
                show-empty="show-empty"
                small="small"
                @filtered="onFiltered">

                <template #cell(amountprice)="data">
                    {{ data.item.amount * data.item.price }} 
                </template>
                
                <template #cell(weightTarget)="data">
                    {{ data.item.weightTarget }} 
                </template>

            </b-table>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: 'Stock',
        created() {
            this
                .$http
                .get('/api/stockApi')
                .then((response) => {
                    this.stocks = response.data
                })
        },
        data() {
            return {
                stocks : [],
                fields: [
                    {
                        key: 'category',
                        label: '행동',
                        sortable: true
                    }, {
                        key: 'ticker',
                        label: '종목명',
                        sortable: true
                    }, {
                        key: 'price',
                        label: '매입단가',
                        sortable: true
                    }, {
                        key: 'amount',
                        label: '매입수량',
                        sortable: true
                    }, {
                        key: 'amountprice',
                        label: '총매입가',
                        sortable: true
                    }, {
                        key: 'weightTarget',
                        label: '목표비중',
                        sortable: true
                    }, {
                        key: 'amountTarget',
                        label: '적정주식수',
                        sortable: true
                    }, {
                        key: 'nowPrice',
                        label: '현재가',
                        sortable: true
                    }, {
                        key: 'nowAmountPrice',
                        label: '총현재가',
                        sortable: true
                    }, {
                        key: 'income',
                        label: '손익',
                        sortable: true
                    }, {
                        key: 'percentIncome',
                        label: '손익률',
                        sortable: true
                    }, {
                        key: 'afterFees',
                        label: '수수료계산후',
                        sortable: true
                    }, {
                        key: 'updownFive',
                        label: '+-5%'
                    }, {
                        key: 'description',
                        label: '비고'
                    }
                ],
                totalRows : 1,
                currentPage: 1,
                perPage: 10,
                pageOptions: [ 5, 10, 20, { value: 100, text: "더 보기" }],
                sortBy: '',
                sortDesc: false,
                sortDirection: 'asc',
                filter: null,
                filterOn: [],
                computed: {
                    sortOptions() {
                    return this.fields
                        .filter(f => f.sortable)
                        .map(f => {
                            return {text: f.label, value: f.key}
                        })
                    }
                },
                mounted() {
                    this.totalRows = this.items.length;
                },
                methods: {
                    onFiltered(filteredItems) {
                        this.totalRows = filteredItems.length
                        this.currentPage = 1;
                    }
                }
            }
        }
    }
</script>

<style></style>