<template>
  <div>
    <b-form-group v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        id="btn-radios-2"
        v-model="selected"
        :options="options"
        :aria-describedby="ariaDescribedby"
        button-variant="outline-primary"
        size="lg"
        name="radios-btn-outline"
        buttons
      ></b-form-radio-group>
    </b-form-group>
    <!-- Using components -->
    <b-input-group prepend="Username" class="mt-3">
      <b-form-input></b-form-input>
      <b-form-input></b-form-input>
      <b-input-group-append>
        <b-button variant="info" v-on:click="send">Send</b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {  
    data() {
      return {
        selected: 'radio1',
        options: [
          { text: 'Radio 1', value: 'radio1' },
          { text: 'Radio 3', value: 'radio2' },
          { text: 'Radio 3', value: 'radio3' },
          { text: 'Radio 4', value: 'radio4' }
        ],
        
      }
    },
    methods: {
      send(){
        this.$http.get('/api/order',{
            params: {
              name : 'name',
              catecory: 'test'
            }
          }).then((response) => {
            console.log(response);
        })
      }
    }
}
</script>

<style>

</style>