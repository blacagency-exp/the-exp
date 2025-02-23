const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const dataDir = path.join(__dirname, "data")
const subscribersFile = path.join(dataDir, "subscribers.json")

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Ensure the subscribers.json file exists
if (!fs.existsSync(subscribersFile)) {
  fs.writeFileSync(subscribersFile, "[]", "utf-8")
}

app.post("/api/subscribe", (req, res) => {
  const { email } = req.body

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" })
  }

  try {
    let subscribers = []

    const fileContent = fs.readFileSync(subscribersFile, "utf-8")
    subscribers = JSON.parse(fileContent)

    if (subscribers.some((subscriber) => subscriber.email === email)) {
      return res.status(409).json({ message: "Email already subscribed" })
    }

    subscribers.push({
      email,
      timestamp: new Date().toISOString(),
    })

    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2))

    res.status(200).json({ message: "Subscription successful" })
  } catch (error) {
    console.error("Subscription error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

