import React, { Component } from "react"
import { Api, JsonRpc, RpcError, JsSignatureProvider } from "eosjs" // https://github.com/EOSIO/eosjs
import { TextDecoder, TextEncoder } from "text-encoding"

import {
  Button,
  Progress,
  CustomInput,
  FormGroup,
  Form,
  Label,
  Input
} from "reactstrap"

const endpoint = "http://localhost:8888"

export default class RateCollabParticipant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobInfo: [],
      jobId: props.match.params.jobid,
      participant: props.match.params.participant
    }
    this.handleFormEvent = this.handleFormEvent.bind(this)

    console.log(this.state)
  }

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

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault()

    console.log()
    // collect form data
    let account = "notechainacc"
    let privateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"

    // prepare variables for the switch below to send transactions
    let actionName = "devsetjobdone"
    let actionData = {
      timestamp: (Date.now() / 1000) | 0,
      jobid: this.state.jobId,
      rating: event.target.score.value,
      developer: "janesmith",
      appraisal: event.target.desc.value
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
                  actor: "notechainacc",
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
      <div style={{ margin: "25px" }}>
        <h1>
          Rate {this.state.participant}'s work on Task #{this.state.jobId}
        </h1>

        <br />

        <div>Task Completion</div>
        <Progress multi>
          <Progress bar value="15" />
          <Progress bar color="success" value="30" />
          <Progress bar color="info" value="25" />
          <Progress bar color="warning" value="20" />
          <Progress bar color="danger" value="5" />
        </Progress>

        <br />
        <br />

        <Form onSubmit={this.handleFormEvent}>
          <FormGroup>
            <Label for="score">Score</Label>
            <Input type="text" name="score" id="score" />
          </FormGroup>

          <FormGroup>
            <Label for="desc">Appraisal Report</Label>
            <Input type="textarea" name="text" id="desc" />
          </FormGroup>

          <div>
            <b>Rating Reward is 25 COLLAB.</b>
          </div>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    )

    // ;<div>{noteCards}</div>
  }
}
