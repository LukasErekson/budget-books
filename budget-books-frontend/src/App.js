import './App.css';
import Navbar from './Components/Navbar';
import Transactions from './Components/Transactions';
import AccountHeader from './Components/AccountComponents/AccountHeader';

function App() {
    return (
        <div className='App'>
            <Navbar />
            <AccountHeader />
            <Transactions />
        </div>
    );
}

export default App;
