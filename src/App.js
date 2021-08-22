import { useState } from "react";
import AccountOverview from "./pages/account/Overview";

function App() {
  const [address, setAddress] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    
    if (e.target.address.value) {
      setAddress(e.target.address.value)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={onSubmit}>
          <input name="address" type="text" placeholder="Enter address"/>
          <button>Submit</button>
        </form>
      </header>
      <AccountOverview account={address} />
    </div>
  );
}

export default App;
