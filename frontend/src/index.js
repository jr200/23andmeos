import React from "react"
import ReactDOM from "react-dom"

import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

import { BrowserRouter as Router, Route } from "react-router-dom"
import { Nav, NavItem, NavLink } from "reactstrap"

import JobMarket from "./components/views/jobmarket"
import BidsForJob from "./components/views/bidsforjob"
import ProjectLog from "./components/views/projectlog"
import Arbitration from "./components/views/arbitration"
import RateCollabParticipant from "./components/views/ratecollabparticipant"
import PublishProject from "./components/views/publishproject"

ReactDOM.render(
  <div>
    <Router>
      <div
        style={{
          display: "block",
          width: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "150px",
          marginBottom: "0px",
          border: "5px red solid"
        }}
      >
        <Nav pills style={{ marginBottom: "25px" }}>
          <NavItem>
            <NavLink href="/jobmarket" active>
              Market Place
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/publishproject">Publish Project</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/bidsforjob">xxBidsForJob</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/projectlog">xxProjectLog</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/ratecollabparticipant">RateCollabJob</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/arbitration">Arbitration</NavLink>
          </NavItem>
        </Nav>

        <div>
          <Route path="/publishproject" component={PublishProject} />
          <Route path="/jobmarket" component={JobMarket} />
          <Route exact path="/" component={JobMarket} />
          <Route
            path="/ratecollabparticipant/:jobid/:participant"
            component={RateCollabParticipant}
          />
          <Route path={`/bidsforjob/:jobid`} component={BidsForJob} />
          <Route path="/projectlog" component={ProjectLog} />
          <Route path="/arbitration" component={Arbitration} />
        </div>
      </div>
    </Router>
  </div>,

  document.getElementById("root")
)
