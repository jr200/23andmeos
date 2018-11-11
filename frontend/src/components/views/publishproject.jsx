import React, { Component } from "react"
import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs" // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding"

import { Button, CustomInput, FormGroup, Form, Label, Input } from "reactstrap"

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

    console.log()
    // collect form data
    let account = "janesmith"
    let privateKey = "5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg"

    // prepare variables for the switch below to send transactions
    let actionName = "emppostjob"
    let actionData = {
      timestamp: (Date.now() / 1000) | 0,
      employer: "block.one",
      title: event.target.title.value,
      desc: event.target.desc.value,
      maxpriceeos: event.target.budget.value
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
    // const { noteTable } = this.state
    // const { classes } = this.props

    return (
      <div style={{ margin: "20px" }}>
        <h1>Project Proposal</h1>
        <Form onSubmit={this.handleFormEvent}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" name="title" id="title" />
          </FormGroup>

          <FormGroup>
            <Label for="desc">Description</Label>
            <Input type="textarea" name="text" id="desc" />
          </FormGroup>

          <FormGroup>
            <Label for="budget">Maximum Budget (EOS)</Label>
            <Input type="text" name="budget" id="budget" />
          </FormGroup>

          <FormGroup>
            <Label for="stakeaddr">EOS Stake Address</Label>
            <Input type="text" name="stakeaddr" id="stakeaddr" />
          </FormGroup>

          <FormGroup>
            <Label for="deadline">Completion Date</Label>
            <Input type="date" name="text" id="deadline" />
          </FormGroup>

          <FormGroup>
            <Label for="filebrowse">File Browser with Custom Label</Label>
            <CustomInput
              type="file"
              id="filebrowse"
              name="customFile"
              label="Attach Documents"
            />
          </FormGroup>

          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    )

    // ;<div>{noteCards}</div>
  }
}
