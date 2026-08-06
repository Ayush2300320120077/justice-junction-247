const mongoose = require('mongoose')
const bookingSchema = new mongoose.Schema({
  client:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  clientName:String,lawyer:{type:mongoose.Schema.Types.ObjectId,ref:'Lawyer',required:true},
  lawyerName:String,caseType:{type:String,required:true},description:String,
  scheduledDate:{type:Date,required:true},scheduledTime:{type:String,required:true},
  duration:{type:Number,default:45},fee:{type:Number,required:true},
  platformFee:{type:Number,default:0},lawyerPayout:{type:Number,default:0},
  status:{type:String,enum:['pending','confirmed','completed','cancelled'],default:'pending'},
  isPaid:{type:Boolean,default:false},paymentId:String,paymentOrderId:String,
  meetingLink:String,caseNumber:{type:String,unique:true},createdAt:{type:Date,default:Date.now}
})
bookingSchema.pre('save',function(next){
  if(!this.caseNumber)this.caseNumber='JJ-'+new Date().getFullYear()+'-'+Math.floor(10000+Math.random()*90000)
  if(!this.platformFee)this.platformFee=Math.round(this.fee*0.10)
  if(!this.lawyerPayout)this.lawyerPayout=this.fee-this.platformFee
  next()
})
module.exports=mongoose.models.Booking||mongoose.model('Booking',bookingSchema)
