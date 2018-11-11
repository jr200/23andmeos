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
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText
} from "reactstrap"

const endpoint = "http://localhost:8888"

export default class JobMarket extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noteTable: [] // to store the table rows from smart contract
    }
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
        table: "jobstruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result => this.setState({ noteTable: result.rows }))
  }

  componentDidMount() {
    this.getTable()
  }

  routeChange = jobid => {
    console.log("CLICKED: " + jobid)
    let path = "/bidsforjob/" + jobid
    this.props.history.push(path)
  }

  render() {
    const { noteTable } = this.state
    // const { classes } = this.props

    // generate each note as a card
    const generateCard = (key, timestamp, employer, title, desc) => (
      <Col sm="6" key={key} style={{ marginTop: "20px" }}>
        <Card>
          <CardBody>
            <CardHeader>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>{title}</div>
                <div>#{key}</div>
              </div>
            </CardHeader>
            <CardText>{desc}</CardText>
            <CardFooter>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button style={{ color: "primary", marginRight: "10px" }}>
                  Make Bid
                </Button>

                <Button
                  color="primary"
                  value={key}
                  onClick={() => this.routeChange(key)}
                >
                  View Bids
                </Button>
              </div>
            </CardFooter>
          </CardBody>
        </Card>
      </Col>
    )
    let noteCards = noteTable
      .reverse()
      .map((row, i) =>
        generateCard(
          row.jobid,
          row.timestamp,
          row.employer,
          row.title,
          row.desc
        )
      )

    return (
      <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Search</InputGroupText>
          </InputGroupAddon>
          <Input />
        </InputGroup>
        <br />
        <Row>{noteCards}</Row>
      </div>
    )

    // ;<div>{noteCards}</div>
  }
}
