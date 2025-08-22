const express = require("express")
const cors = require("cors")

const donation = {
    money: 0,
    people: 0
}

const app = express()


app.use(cors())
app.use(express.json())


app.get("/testing", (req, res) => {
    res.send("All Right!")
})

app.post("/donate", (req, res) => {
    const amount = req.body.amount || 0

    if(amount > 0) {
        donation.money += amount
        donation.people += 1
    }
   
    return res.json({message: "Thank You!"})
})

app.get("/dashboard", (req, res) => {

    if(req.headers.accept === "text/event-stream") {

        // opening a new HTTP connection everytime and sending data is expensive
        // Server Sent Events are differnt than that
        // this is a long lived HTTP connection which sends data whenever there is new information available
        // or on regular intervals
        
        // SSE has less overhead than simple HTTP approach because the connection is kept alive
        // and the TCP hadnshake and HTTP headers are not repeated
        

        res.writeHead(200, {
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream'
        })

        const sseId = new Date().toDateString()

        setInterval(() => {
            res.write(`id: ${sseId}\n`)
            res.write(`data: ${JSON.stringify(donation)}\n\n`)
        }, 1000)

    }

    else {
        res.json({message: "Event Stream Not Accepted!"})
    }

})


app.listen(9000, () => {
    console.log("Server Running!")
})