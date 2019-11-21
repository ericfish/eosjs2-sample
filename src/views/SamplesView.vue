<template>
  <div id="samples">
    <h1>-- {{connectedResult}} --</h1>
    <h1>-- {{loignResult}} --</h1>
    <el-button @click="login">登录</el-button>
    <el-button @click="logout">注销</el-button>
    <el-button @click="transfer">转账</el-button>
  </div>
</template>
<script>
/* eslint-disable */
import { RouteNames } from "../router.js";
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import {JsonRpc, Api} from 'eosjs';
const ecc = require('eosjs-ecc')

ScatterJS.plugins( new ScatterEOS() );
const network = ScatterJS.Network.fromJson({
          blockchain:'eos',
          chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
          host:'nodes.get-scatter.com',
          port:443,
          protocol:'https'
      });

export default {
  name: "samples",
  data() {
    return {
      connectedResult:"",
      loignResult:"",
      account:null
    };
  },
  mounted() {
    ScatterJS.connect("Sample",{network}).then(connected => {
      this.connectedResult = connected?"Scatter Connected":"No Scatter";
    });
  },
  methods: {
    login() {
      ScatterJS.login().then(id => {
        if(!id) return console.error('no identity');
        
        const account = ScatterJS.account('eos');
        this.account = account;
        this.loignResult = account.name+" "+account.authority;
      });
    },
    logout(){
      ScatterJS.logout().then(res => {

      });
    },
    transfer() {
      const rpc = new JsonRpc(network.fullhost());
      const eos = ScatterJS.eos(network, Api, {rpc});
      eos.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: this.account.name,
                    permission: this.account.authority,
                }],
                data: {
                    from: this.account.name,
                    to: 'bigsharkfish',
                    quantity: '0.0001 EOS',
                    memo: "",
                }
              },{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: this.account.name,
                    permission: this.account.authority,
                }],
                data: {
                    from: this.account.name,
                    to: 'cpufeeincome',
                    quantity: '0.0100 EOS',
                    memo: "cpu fee",
                }
            }
            ]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then(res => {
            console.log('sent: ', res);
        }).catch(err => {
            console.error('error: ', err);
        });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.row {
  text-align: center;
  border: 1px solid #bbb;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
</style>
