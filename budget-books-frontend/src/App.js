import './App.css';
import Navbar from './Components/Navbar';
import Transactions from './Components/Transactions';
import AccountContainer from './Components/AccountComponents/AccountContainer';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <AccountContainer />
      <Transactions />
    </div>
  );
}

export default App;
