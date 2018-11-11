import React, { Component } from "react"
import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs" // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding"
import {
  Card,
  CardText,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  CardSubtitle,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText
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
    this.handleFormEvent = this.handleFormEvent.bind(this)
    console.log("CONSTRUCTOR: " + this.state.jobId)
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault()

    // collect form data
    let account = event.target.account.value
    let privateKey = event.target.privateKey.value
    let note = event.target.note.value

    // prepare variables for the switch below to send transactions
    let actionName = ""
    let actionData = {}

    // define actionName and action according to event type
    switch (event.type) {
      case "submit":
        actionName = "update"
        actionData = {
          user: account,
          note: note
        }
        break
      default:
        return
    }

    // eosjs function call: connect to the blockchain
    const rpc = new JsonRpc(endpoint)
    const signatureProvider = new JsSignatureProvider([privateKey])
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "notechainacc",
              name: actionName,
              authorization: [
                {
                  actor: account,
                  permission: "active"
                }
              ],
              data: actionData
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      )

      console.log(result)
      this.getTable()
    } catch (e) {
      console.log("Caught exception: " + e)
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2))
      }
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
    const { params } = this.props.match
    const { jobid } = params

    this.getTable(jobid)
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
