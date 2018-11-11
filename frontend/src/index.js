import React from "react"
import ReactDOM from "react-dom"

import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Contact from "./components/views/contact"
import NoteChain from "./components/views/notechain"
import Index from "./components/landing"

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Index} />
      <Route path="/contact" component={Contact} />
      <Route path="/notechain" component={NoteChain} />
    </div>
  </Router>,
  document.getElementById("root")
)
