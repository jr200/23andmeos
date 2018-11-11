import { Router } from "express"
import { listConfirmed, jobsSubmitted, bidsSubmitted } from "../services/post"

export default () => {
  let api = Router()

  api.get("/", listConfirmed)
  api.get("/jobs", jobsSubmitted)
  api.get("/bids", bidsSubmitted)

  return api
}
