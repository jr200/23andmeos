import mongoose from "mongoose"

const { Schema } = mongoose

let Bid = null

try {
  const BidSchema = new Schema({
    _id: {
      timestamp: Number,
      developer: String
    },
    developer: String,
    jobid: {
      type: Number,
      default: 0
    },
    bidprice: {
      type: Number,
      default: 0
    },
    bidtimehours: {
      type: Number,
      default: 0
    }
  })
  Bid = mongoose.model("Bid", BidSchema)
} catch (e) {
  Bid = mongoose.model("Bid")
}

export default Bid
