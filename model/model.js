const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  from:{type:String},
  to:{type:String},
  value:{type:String},
  data:{type:String},
  hash:{type:String},
  alltransaction:{type:String}
},

{timestamps:true, default: Date.now}
) 

module.exports = mongoose.model('ERC20', Schema)


