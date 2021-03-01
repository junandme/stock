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
    export default {
        async created() {
            this.calcStockData(await this.$http.get('/api?name='+this.name));

            response.data[1].forEach(item => {
                if(item.category === "deposit" || item.category === "interest" || item.category === "dividend") {
                    this.myAccount = parseInt(this.myAccount) + parseInt(item.price);
                } else if(item.category === "withdraw") {
                    this.myAccount = parseInt(this.myAccount) - parseInt(item.price);
                } else { }
            });
        },
        methods: {
            async calcStockData(response){
                for(let item of response.data[0]){
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
                        } else { }
                    } else {
                        const iexResponse = await this.$http.get('https://cloud.iexapis.com/stable/stock/'+item.ticker+'/quote?token=pk_6ee50fde81c24341bdca5f071708c226')
                        item.nowPrice = iexResponse.data.latestPrice;
                        this.stocks.push(item)
                    }
                }
            }
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