<template>
    <div>
        <!-- Using components -->
        <b-input-group prepend="Username" class="mt-3">
            <b-form-input></b-form-input>
            <b-input-group-append>
            <b-button variant="info">Button</b-button>
            </b-input-group-append>
        </b-input-group>
        <b-table hover :items="items"></b-table>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  created () {
    this.$http.get('/api/stockApi')
      .then((response) => {
        this.stockApi = response.data
      })
  },
  data () {
    return {
      stockApi: [],
      items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          {
            age: 89,
            first_name: 'Geneva',
            last_name: 'Wilson',
            _rowVariant: 'danger'
          },
          {
            age: 40,
            first_name: 'Thor',
            last_name: 'MacDonald',
            _cellVariants: { age: 'info', first_name: 'warning' }
          },
          { age: 29, first_name: 'Dick', last_name: 'Dunlap' }
        ]
    }
  }
}
</script>