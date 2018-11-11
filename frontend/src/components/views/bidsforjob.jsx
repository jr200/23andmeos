import React, { Component } from "react"
import { JsonRpc } from "eosjs" // https://github.com/EOSIO/eosjs

import {
  Card,
  CardText,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Row,
  Col
} from "reactstrap"
const endpoint = "http://localhost:8888"

export default class BidsForJob extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noteTable: [], // to store the table rows from smart contract,
      jobInfo: [],
      jobId: props.match.params.jobid
    }
    console.log("CONSTRUCTOR: " + this.state.jobId)
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
    const rpc = new JsonRpc(endpoint)
    rpc
      .get_table_rows({
        json: true,
        code: "notechainacc", // contract who owns the table
        scope: "notechainacc", // scope of the table
        table: "bidstruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result =>
        this.setState({
          noteTable: result.rows.filter(res => res.jobid == this.state.jobId)
        })
      )

    rpc
      .get_table_rows({
        json: true,
        code: "notechainacc", // contract who owns the table
        scope: "notechainacc", // scope of the table
        table: "jobstruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(
        result => {
          // this.setState({
          console.log(" Searching: " + this.state.jobId)
          const jobInfo = result.rows.find(res => res.jobid == this.state.jobId)
          this.setState({ jobInfo: jobInfo })
        }
        // })
      )
  }

  componentDidMount() {
    this.getTable()
  }

  renderJobTitle() {
    console.log("jrenderjobobtitle:")
    console.log(this.state.jobInfo)
    return (
      <div>
        <h1>{this.state.jobInfo.title}</h1>
        <p>{this.state.jobInfo.desc}</p>
        <p>{this.props.jobdesc}</p>
      </div>
    )
  }
  render() {
    console.log("render")

    const { noteTable } = this.state

    let noteCards = []
    if (noteTable.length == 0) {
      noteCards = <h1>No bids Have been received.</h1>
    } else {
      // const { classes } = this.props

      // generate each note as a card
      const generateCard = (
        key,
        jobid,
        timestamp,
        developer,
        bidpriceeos,
        bidtimehours,
        bidaccepted
      ) => (
        <Col sm="6" key={key}>
          <Card>
            <CardBody>
              <CardHeader>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{developer}</div>
                  <div>
                    {bidpriceeos} EOS/{bidtimehours} hours
                  </div>
                </div>
              </CardHeader>
              <CardText>DETAILS about user</CardText>
              <CardFooter>
                <div>
                  <Button color="success">Accept</Button>
                  <Button color="danger">Decline</Button>
                </div>
              </CardFooter>
            </CardBody>
          </Card>
        </Col>
      )
      noteCards = noteTable.map((row, i) =>
        generateCard(
          row.bidid,
          row.jobid,
          row.timestamp,
          row.developer,
          row.bidpriceeos,
          row.bidtimehours,
          row.bidaccepted
        )
      )
    }

    // uint64_t bidid;
    // uint64_t jobid;
    // string developer;
    // uint64_t bidpriceeos;
    // uint64_t bidtimehours;
    // uint64_t bidaccepted;

    return (
      <div>
        <Row>{this.renderJobTitle()}</Row>
        <Row>{noteCards}</Row>
      </div>
    )

    // ;<div>{noteCards}</div>
  }
}
