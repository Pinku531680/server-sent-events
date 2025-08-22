import React, {useState, useEffect} from "react";
import './App.css';
import axios from "axios";


function App() {

  const [donation, setDonation] = useState({
    money: 0, 
    people: 0
  })

  const [amount, setAmount] = useState(0)

  const handleDonation = () => {
    console.log(amount)
    
    axios.post("http://localhost:9000/donate", {amount : amount})
      .then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })

  }

  // the EventSource API automatically handles reconnections and keeps the memory usage low
  // on client and server which is better than freqquent polling

  useEffect(() => {
    const source = new EventSource('http://localhost:9000/dashboard')

    source.onopen = (ev) => {
      console.log("SSE Opened!")
    }

    source.onmessage = (ev) => {
      let data = JSON.parse(ev.data)
      // console.log(data)
      // console.log("Data...")

      setDonation(data)

    }

    source.onerror = (ev) => {
      console.log("Some Error!")
    }

    return () => {
      source.close()
    }


  }, [])

  return (
    <div className="all">
      <p id="heading">Donations</p>
      <div className="donations">
          <div className="money">
            <p>Money : </p>
            <span>{donation.money}</span>
          </div>
          <div className="people">
            <p>Donations : </p>
            <span>{donation.people}</span>
          </div>
      </div>
      <div className="add-donation">
          <input placeholder="Enter amount" maxLength={3}
          onChange={(e) => setAmount(Number(e.target.value))}
          value={amount}
          />
          <button onClick={handleDonation}>
            Donate
          </button>
      </div>
    </div>
  );
}

export default App;
