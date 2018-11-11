import mongoose from "mongoose"

const { Schema } = mongoose

let Job = null

try {
  const JobSchema = new Schema({
    _id: {
      timestamp: Number,
      employer: String
    },
    employer: String,
    title: String,
    description: String,
    bids: {
      type: Number,
      default: 0
    },
    bidAccepted: {
      type: Number,
      default: 0
    }
  })
  Job = mongoose.model("Job", JobSchema)
} catch (e) {
  Job = mongoose.model("Job")
}

export default Job
