import React, { useEffect, useState } from 'react';
import { getWeb3, getWallet } from './utils.js'; 
import Header from './Header.js';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';
import './App.css';
import background from "./images/Background-V1.1-1.png";
import logo from "./images/Logo.png";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();

      let promises = transfers.map(async transfer => {
        let newTransfer = [...transfer];
        newTransfer.id = transfer.id;
        newTransfer.amount = transfer.amount;
        newTransfer.to = transfer.to;
        newTransfer.approvals = transfer.approvals;
        newTransfer.sent = transfer.sent;
        newTransfer.approvedByUser = await wallet.methods.approvals(accounts[0], transfer.id).call();
        return newTransfer;
      });

      let newTransfers = [];
      for await (let newTransfer of promises){
        newTransfers.push(newTransfer);
      }
  
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(newTransfers);
    };
    init();
  }, []);

  const ingestApprovedByUser = async transfers => {
      let promises = transfers.map(async transfer => {
        let newTransfer = [...transfer];
        newTransfer.id = transfer.id;
        newTransfer.amount = transfer.amount;
        newTransfer.to = transfer.to;
        newTransfer.approvals = transfer.approvals;
        newTransfer.sent = transfer.sent;
        newTransfer.approvedByUser = await wallet.methods.approvals(accounts[0], transfer.id).call();
        return newTransfer;
      });
  
      let newTransfers = [];
      for await (let newTransfer of promises){
        newTransfers.push(newTransfer);
      }
  
      setTransfers(newTransfers);
    }
    
  const createTransfer = async transfer => {
    await wallet.methods
      .createTransfer(transfer.amount, transfer.to)
      .send({from: accounts[0]});
    await fetchTransferList();
  }

  const approveTransfer = async transferId => {
    await wallet.methods
      .approveTransfer(transferId)
      .send({from: accounts[0]});
    await fetchTransferList();
  }
  
  const fetchTransferList = async () => {
    const transfers = await wallet.methods.getTransfers().call();
    ingestApprovedByUser(transfers);
  }

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof wallet === 'undefined'
    || approvers.length === 0
    || typeof quorum === 'undefined'
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      backgroundImage: `url(${background})`,
      width: '100vw',
      height: '100vh'
    }}>
      <div>
      <img id="logo" src={logo} alt="Logo" />;
      </div>

      <div id="main">
      <Header approvers={approvers} quorum={quorum} />
      <NewTransfer createTransfer={createTransfer} />
      <TransferList transfers={transfers} approveTransfer={approveTransfer} />
      </div> 

    </div>
  );
}

export default App;
