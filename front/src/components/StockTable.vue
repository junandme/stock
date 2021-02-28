<template>
    <div>
        총 투자금: {{ myAccount }}
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
                .get('/api')
                .then((response) => {
                    // this.stocks = response.data[0]
                    // console.log(response.data[0]);
                    response.data[0].forEach(item => {
                        var existingStock = this.stocks.filter(function(element) {
                            return element.ticker === item.ticker;
                        })
                        if(existingStock != "") {
                            var index = this.stocks.findIndex(function(tem, i) {
                                return tem.ticker === item.ticker
                            });
                            var beforePrice = parseInt(this.stocks[index].price);
                            var beforeAmount = parseInt(this.stocks[index].amount);
                            var nowPrice = parseInt(item.price);
                            var nowAmount = parseInt(item.amount);
                            if(item.category === "buy") {
                                this.stocks[index].amount = beforeAmount + nowAmount;
                                this.stocks[index].price = ( (beforePrice*beforeAmount) + (nowPrice*nowAmount) ) / this.stocks[index].amount;
                            } else if(item.category === "sell") {
                                this.stocks[index].amount = beforeAmount - nowAmount;
                                this.stocks[index].price = ( (beforePrice*beforeAmount) - (nowPrice*nowAmount) ) / this.stocks[index].amount;
                            } else {
                                
                            }
                        } else {
                            this.stocks.push(item)
                        }
                    });

                    response.data[1].forEach(item => {
                        if(item.category === "deposit" || item.category === "interest" || item.category === "dividend") {
                            this.myAccount = parseInt(this.myAccount) + parseInt(item.price);
                        } else if(item.category === "withdraw") {
                            this.myAccount = parseInt(this.myAccount) - parseInt(item.price);
                        } else {

                        }
                    });
                })
        },
        data() {
            return {
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