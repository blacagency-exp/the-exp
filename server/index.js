require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const { createClient } = require("@supabase/supabase-js")

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL = "https://api.paystack.co"

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

if (!PAYSTACK_SECRET_KEY || !PAYSTACK_SECRET_KEY.startsWith("sk_")) {
  console.error("Invalid or missing PAYSTACK_SECRET_KEY. Please check your .env file.")
  process.exit(1)
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Please check your .env file.")
  process.exit(1)
}

const dataDir = path.join(__dirname, "data")
const subscribersFile = path.join(dataDir, "subscribers.json")

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

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

app.post("/api/initialize-payment", async (req, res) => {
  try {
    const { email, amount, metadata } = req.body

    console.log("Received payment initialization request:", { email, amount, metadata })

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo and ensure it's an integer
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    console.log("Paystack API response:", response.data)

    // Save initial booking details to Supabase
    const bookingData = {
      email,
      amount,
      payment_reference: response.data.data.reference,
      payment_status: "pending",
      first_name: metadata.firstName,
      last_name: metadata.lastName,
      phone_number: metadata.phoneNumber,
      package_type: metadata.packageType,
      traveler_type: metadata.travelerType,
      group_size: metadata.groupSize,
      specific_requests: metadata.specificRequests,
    }

    console.log("Attempting to save booking data to Supabase:", bookingData)

    const { data, error } = await supabase.from("bookings").insert([bookingData])

    if (error) {
      console.error("Error saving booking to Supabase:", error)
      throw new Error(`Failed to save booking: ${error.message}`)
    } else {
      console.log("Booking saved successfully:", data)
    }

    res.json(response.data)
  } catch (error) {
    console.error("Payment initialization failed:", error.response ? error.response.data : error.message)
    res.status(500).json({ error: "Failed to initialize payment", details: error.message })
  }
})

app.get("/api/verify-payment/:reference", async (req, res) => {
  try {
    const { reference } = req.params

    console.log("Received payment verification request for reference:", reference)

    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Paystack API verification response:", response.data)

    // Update booking status in Supabase
    const { data, error } = await supabase
      .from("bookings")
      .update({ payment_status: response.data.data.status })
      .eq("payment_reference", reference)

    if (error) {
      console.error("Error updating booking status in Supabase:", error)
      throw new Error(`Failed to update booking status: ${error.message}`)
    } else {
      console.log("Booking status updated successfully:", data)
    }

    res.json(response.data)
  } catch (error) {
    console.error("Payment verification failed:", error.response ? error.response.data : error.message)
    res.status(500).json({ error: "Failed to verify payment", details: error.message })
  }
})

// Test Supabase connection
app.get("/api/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase.from("bookings").select("*").limit(1)

    if (error) {
      throw error
    }

    res.json({ message: "Supabase connection successful", data })
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    res.status(500).json({ error: "Failed to connect to Supabase", details: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log("PAYSTACK_SECRET_KEY is set and valid")
  console.log("Supabase connection is set up")
})

