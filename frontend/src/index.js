import React from "react"
import ReactDOM from "react-dom"

import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import JobMarket from "./components/views/jobmarket"
import BidsForJob from "./components/views/bidsforjob"
import ProjectLog from "./components/views/projectlog"
import Arbitration from "./components/views/arbitration"
import NoteChain from "./components/views/notechain"
import Index from "./components/landing"

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Index} />
      <Route path="/notechain" component={NoteChain} />
      <Route path="/jobmarket" component={JobMarket} />
      <Route path="/bidsforjob" component={BidsForJob} />
      <Route path="/projectlog" component={ProjectLog} />
      <Route path="/arbitration" component={Arbitration} />
    </div>
  </Router>,
  document.getElementById("root")
)
