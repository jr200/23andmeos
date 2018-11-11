import React from "react"
import ReactDOM from "react-dom"

import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink
} from "reactstrap"

import JobMarket from "./components/views/jobmarket"
import BidsForJob from "./components/views/bidsforjob"
import ProjectLog from "./components/views/projectlog"
import Arbitration from "./components/views/arbitration"
import Index from "./components/landing"

ReactDOM.render(
  <Router>
    <div>
      <Nav pills>
        <NavItem>
          <NavLink href="/" active>
            NoteChain
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/jobmarket">Market Place</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/bidsforjob">xxBidsForJob</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/projectlog">xxProjectLog</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/arbitration">Arbitration</NavLink>
        </NavItem>
      </Nav>

      <div>
        <Route exact path="/" component={Index} />
        <Route path="/jobmarket" component={JobMarket} />
        <Route path="/bidsforjob" component={BidsForJob} />
        <Route path="/projectlog" component={ProjectLog} />
        <Route path="/arbitration" component={Arbitration} />
      </div>
    </div>
  </Router>,
  document.getElementById("root")
)
