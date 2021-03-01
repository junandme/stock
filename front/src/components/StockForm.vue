<template>
  <div>
    
    
    <b-container fluid="fluid">
      <b-row>
        <b-col cols="4">
          <b-input-group prepend="이름" class="mt-3">
            <b-form-input v-model="name"></b-form-input>
            <b-input-group-append>
              <b-button variant="info" @click="showData">보기</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            id="btn-radios"
            v-model="category"
            :options="options"
            :aria-describedby="ariaDescribedby"
            button-variant="outline-primary"
            size="lg"
            name="radios-btn-outline"
            buttons
            @change="setCategoryText"
          ></b-form-radio-group>
        </b-form-group>
      </b-row>
      <b-row>        
        <b-col v-if="category === 'buy' || category ==='sell' || category === 'dividend'">
          <b-input-group prepend="종목명" class="mt-3">
            <b-form-input v-model="ticker"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col v-if="category === 'buy' || category ==='sell'">
          <b-input-group prepend="수량" class="mt-3">
            <b-form-input v-model="amount"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col>
          <b-input-group prepend="$" class="mt-3">
              <b-form-input v-model="price"></b-form-input>
              <b-input-group-append>
              <b-button @click="showModal">Send</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        
      </b-row>
    </b-container>

    <b-modal ref="sendCheck" hide-footer title="경고">
      <div class="d-block text-center">
        <h3>{{ categoryText }} 하시겠습니까?</h3>
        <p v-if="category === 'buy' || category ==='sell' || category === 'dividend'">{{ ticker }}</p>
        <p v-if="category === 'buy' || category ==='sell'">수량 {{ amount }}</p>
        <p >금액 {{ price }}</p>
        <p v-if="category === 'buy' || category ==='sell'">총 금액 {{ amount * price }}</p>
      </div>
      <b-row>
        <b-col><b-button class="mt-3" variant="outline-danger" block @click="send">확인</b-button></b-col>
        <b-col><b-button class="mt-3" variant="outline-warning" block @click="hideModal">취소</b-button></b-col>
      </b-row>
    </b-modal>

  </div>
</template>

<script>
export default {  
    data() {
      return {
        category: 'buy',
        categoryText: "매수",
        options: [
          { text: '매수', value: 'buy' },
          { text: '매도', value: 'sell' },
          { text: '입금', value: 'deposit' },
          { text: '출금', value: 'withdraw' },
          { text: '배당', value: 'dividend' },
          { text: '이자', value: 'interest' }
        ],
        name: this.$route.query.name,
        ticker: '',
        price: 0,
        amount: 0,
      }
    },
    methods: {      
      setCategoryText(){
        for(let option of this.options){
          if(option.value == this.category){
            this.categoryText = option.text;
          }
        }
      },
      showData(){
        // window.location = window.location.origin+"/#?name="+this.name;
        window.location = '/?name='+this.name;
      },
      showModal() {
        this.$refs['sendCheck'].show()
      },
      hideModal() {
        this.$refs['sendCheck'].hide()
      },
      send(){
        switch(this.category){
          case 'buy':
          case 'sell':
            this.sendDeal();
            break;
          case 'dividend':
            this.sendDividend();
            break;
          case 'deposit':
          case 'withdraw':
          case 'interest':
            this.sendOnlyPrice();
        }
        this.hideModal();
      },
      sendOnlyPrice(){
        this.$http.put('/api/order',{
            name : this.name,
            category: this.category,
            price: this.price
          }).then((response) => {
            console.log(response);
            console.log('sendOnlyPrice');
        })
      },
      sendDeal(){
        this.$http.put('/api/order',{
            name : this.name,
            category: this.category,
            ticker: this.ticker,
            price: this.price,
            amount: this.amount
          }).then((response) => {
            console.log(response);
            console.log('sendDeal');
        })
      },
      sendDividend(){
        this.$http.put('/api/order',{
            name : this.name,
            category: this.category,
            ticker: this.ticker,
            price: this.price
          }).then((response) => {
            console.log(response);
            console.log('sendDividend');
        })
      }
    }
}
</script>

<style>

</style>