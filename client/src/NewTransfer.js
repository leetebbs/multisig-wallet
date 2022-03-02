import React, { useState } from 'react';

function NewTransfer({createTransfer}) {
  const [transfer, setTransfer] = useState(undefined);

  const submit = e => {
    e.preventDefault();
    createTransfer(transfer);

  }

  const updateTransfer = (e, field) => {
    const value = e.target.value;
    setTransfer({...transfer, [field]: value});
  
    
  }

  const mystyle = {
    color: "#9003fc",
    marginRight: "20px",
    fontFamily: "Arial"
  };

  return (
    <div>
      <h2 style={{ color: '#fff' }}>Create transfer</h2>
      <form onSubmit={e => submit(e)} >
        <label style={{ color: '#fff' }} htmlFor="amount">Amount </label>
        <input 
          id="amount"
          type="text" 
          onChange={e => updateTransfer(e, 'amount')} 
        />
        <label style={{ color: '#fff' }} htmlFor="to"> To </label>
        <input 
          id="to"
          type="text" 
          onChange={e => updateTransfer(e, 'to')} 
        />
        <button  id="button" style={mystyle}> Submit</button>
      </form>
    </div>
  );
}

export default NewTransfer;