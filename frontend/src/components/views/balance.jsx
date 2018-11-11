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

export default class Balance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collabTokens: 0
    }
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
    const rpc = new JsonRpc(endpoint)
    rpc
      .get_currency_balance("eosio.token", "janesmith", "COLLAB")
      .then(result => this.setState({ collabTokens: result.rows }))
  }

  componentDidMount() {
    this.getTable()
  }

  render() {
    const { collabTokens } = this.state
    console.log(collabTokens)

    return <div />
  }
}
