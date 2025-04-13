import mongoose from 'mongoose';
 
 const banditSchema = new mongoose.Schema({
   userId: { type: String, required: true, unique: true },
   models: {
     type: Map,
     of: {
       weights: [Number],
       bias: Number
     }
   },
 }, { timestamps: true });
 
 const BanditModel = mongoose.model('BanditModel', banditSchema);
 export default BanditModel;