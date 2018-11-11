import React, { Component } from "react"
import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs" // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding"
import { Card, CardText, CardBody, CardHeader, CardSubtitle } from "reactstrap"

const endpoint = "http://localhost:8888"

export default class JobMarket extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noteTable: [] // to store the table rows from smart contract
    }
    this.handleFormEvent = this.handleFormEvent.bind(this)
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
        table: "jobstruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result => this.setState({ noteTable: result.rows }))
  }

  componentDidMount() {
    this.getTable()
  }

  render() {
    const { noteTable } = this.state
    const { classes } = this.props

    // generate each note as a card
    const generateCard = (key, timestamp, employer, title, desc) => (
      <Card key={key}>
        <CardBody>
          <CardHeader>{title}</CardHeader>
          <CardSubtitle>{new Date(timestamp * 1000).toString()}</CardSubtitle>
          <CardText>{desc}</CardText>
        </CardBody>
      </Card>
    )
    let noteCards = noteTable.map((row, i) =>
      generateCard(i, row.timestamp, row.employer, row.title, row.desc)
    )

    return <div>{noteCards}</div>
  }
}
