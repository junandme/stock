<template>
    <div>
        총 투자금: {{ myAccount }}
        <b-container fluid="fluid">
            <!-- User Interface controls -->
            <b-row>
                <b-col lg="12" class="my-1">
                    <b-form-group>
                        <b-input-group size="sm">
                            <b-form-input
                                id="filter-input"
                                v-model="filter"
                                type="search"
                                placeholder="검색어를 입력하세요"></b-form-input>

                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">지우기</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
                :items="stocks"
                :fields="fields"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                stacked="md"
                show-empty="show-empty"
                small="small">

                <template #cell(amountprice)="data">
                    {{ data.item.amount * data.item.price }}
                </template>
                
                <template #cell(weightTarget)="data">
                    {{ data.item.weightTarget }} 
                </template>

                <template #cell(nowtPrice)="data">
                    {{ data.item.nowPrice }} 
                </template>

                <template #cell(nowAmountPrice)="data">
                    {{ data.item.nowPrice * data.item.amount }} 
                </template>
                
                <template #cell(income)="data">
                    {{ (data.item.nowPrice*data.item.amount) - (data.item.amount*data.item.price) }} 
                </template>
                
                <template #cell(percentIncome)="data">
                    {{ (1-(data.item.amount*data.item.price)/(data.item.nowPrice*data.item.amount))*100 }} 
                </template>
                
            </b-table>
        </b-container>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        created() {
            this
                .$http
                .get('/api?name='+this.name)
                .then((response) => {
                    this.myAccount = response.data[0];
                    this.stocks = response.data[1];
                })
        },
        data() {
            return {
                name: this.$route.query.name,
                myAccount : 0,
                stocks : [],
                fields: [
                    {
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
                }
            }
        }
    }
</script>

<style></style>