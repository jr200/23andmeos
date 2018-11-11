import { Post, Job, Bid } from "../../models"

/**
 * Get list of all posts confirmed by the blockchain
 * @returns {Post[]}
 */
export const listConfirmed = async (req, res) => {
  try {
    const confirmedPosts = await Post.find({ postConfirmed: true }).exec()
    res.send(confirmedPosts)
  } catch (err) {
    console.error(err)
  }
}

export const jobsSubmitted = async (req, res) => {
  try {
    const availableJobs = await Job.find({ postConfirmed: true }).exec()
    res.send(availableJobs)
  } catch (err) {
    console.error(err)
  }
}

export const bidsSubmitted = async (req, res) => {
  try {
    const submittedBids = await Bid.find({ postConfirmed: true }).exec()
    res.send(submittedBids)
  } catch (err) {
    console.error(err)
  }
}
