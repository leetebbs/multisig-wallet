import React from 'react';

function Header({approvers, quorum}) {
  return (
    <header style={{ color: '#fff' }}>
      <h1>Multisig Dapp</h1>
      <ul>
        <li>Approvers: {approvers.join(',  ')}</li>
        <li>Quorum: {quorum}</li>
      </ul>
    </header>
  );
}

export default Header;
