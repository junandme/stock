<template>
    <b-table hover="hover" :items="items"></b-table>
</template>

<script>
    export default {
        name: 'Stock',
        created() {
            this
                .$http
                .get('/api/stockApi')
                .then((response) => {
                    this.stockApi = response.data
                })
        },
        data() {
            return {
                stockApi: [],
                items: [
                    {
                        age: 40,
                        first_name: 'Dickerson',
                        last_name: 'Macdonald'
                    }, {
                        age: 21,
                        first_name: 'Larsen',
                        last_name: 'Shaw'
                    }, {
                        age: 89,
                        first_name: 'Geneva',
                        last_name: 'Wilson',
                        _rowVariant: 'danger'
                    }, {
                        age: 40,
                        first_name: 'Thor',
                        last_name: 'MacDonald',
                        _cellVariants: {
                            age: 'info',
                            first_name: 'warning'
                        }
                    }, {
                        age: 29,
                        first_name: 'Dick',
                        last_name: 'Dunlap'
                    }
                ]
            }
        }
    }
</script>

<style></style>