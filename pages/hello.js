import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React, {Component} from 'react'
import { columns } from '../components/columns'
import DataTable from 'react-data-table-component';
import axios from 'axios';

export class index extends Component {
  constructor(props){
    super(props)
    this.state = {
      data:[]
    }
  }
    
    render() {
      const titleStyle= {  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'}
      return(
        <body>
      <header style={titleStyle}>
        <p>DreamBoat Won Blocks</p>
      </header>
      <div className="container">
      <DataTable
          columns={columns}
          data={this.state.data}
          pagination
          paginationServer
          />
      </div>
      </body>
    )
  }
}
export default index