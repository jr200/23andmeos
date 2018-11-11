import React, { Component } from "react"
import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs" // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding"
import { withRouter } from "react-router-dom"
import {
  Card,
  CardText,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  FormGroup,
  CardSubtitle,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  Label,
  Input,
  FormText
} from "reactstrap"

const endpoint = "http://localhost:8888"

export default class PublishProject extends Component {
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

      let path = "/jobmarket"
      this.props.history.push(path)
    } catch (e) {
      console.log("Caught exception: " + e)
      if (e instanceof RpcError) {
        console.log(JSON.stringify(e.json, null, 2))
      }
    }
  }

  render() {
    const { noteTable } = this.state
    const { classes } = this.props

    return (
      <div margin="50">
        <Form>
          <FormGroup>
            <Label for="title">Project Title</Label>
            <Input type="text" name="title" id="title" />
          </FormGroup>

          <FormGroup>
            <Label for="budget">Maximum Budget (EOS)</Label>
            <Input type="text" name="budget" id="budget" />
          </FormGroup>

          <FormGroup>
            <Label for="deadline">Completion Date</Label>
            <Input type="date" name="text" id="deadline" />
          </FormGroup>

          <Button type="button" onClick={this.handleFormEvent}>
            Submit
          </Button>
        </Form>
      </div>
    )

    // ;<div>{noteCards}</div>
  }
}
