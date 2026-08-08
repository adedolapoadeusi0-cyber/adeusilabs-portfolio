const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/*
========================================
EMAILJS EMAIL FUNCTION
========================================
*/

async function sendEmail({
    name,
    email,
    business,
    websiteType,
    pages,
    features,
    estimatedCost,
    timeline
}) {
    const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,

                template_params: {
                    name,
                    email,
                    business,
                    websiteType,
                    pages,
                    features,
                    estimatedCost,
                    timeline
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();

        console.error("❌ EmailJS Error:", error);

        throw new Error("Email failed to send");
    }

    console.log("✅ EmailJS message sent successfully!");
}


/*
========================================
HOME ROUTE
========================================
*/

app.get("/", (req, res) => {
    res.send("AdeusiLabs Backend Running 🚀");
});


/*
========================================
ESTIMATE FORM
========================================
*/

app.post("/estimate", async (req, res) => {

    console.log("\n=================================");
    console.log("📩 NEW ESTIMATE REQUEST");
    console.log("=================================");

    console.log("Body:", req.body);

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "No request body received."
        });
    }

    const {
        name,
        email,
        business,
        websiteType,
        pages,
        features,
        estimatedCost,
        timeline
    } = req.body;


    /*
    ========================================
    VALIDATE REQUIRED FIELDS
    ========================================
    */

    if (!name || !email || !business) {
        return res.status(400).json({
            success: false,
            message: "Name, email and business are required."
        });
    }


    /*
    ========================================
    FORMAT FEATURES
    ========================================
    */

    const featureList = Array.isArray(features)
        ? features.join(", ")
        : features || "None";


    /*
    ========================================
    SEND ESTIMATE TO ADEUSILABS
    ========================================
    */

    try {

        console.log("📤 Sending estimate to AdeusiLabs...");

        await sendEmail({
            name,
            email,
            business,
            websiteType,
            pages,
            features: featureList,
            estimatedCost,
            timeline
        });

        console.log("✅ Estimate email sent to AdeusiLabs");


        /*
        ========================================
        CLIENT CONFIRMATION EMAIL
        ========================================

        We will add this after creating
        the second EmailJS template.
        */


        return res.status(200).json({
            success: true,
            message: "Estimate submitted successfully!"
        });

    } catch (error) {

        console.error("❌ EMAIL ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Estimate received, but we could not send the email."
        });
    }
});


/*
========================================
START SERVER
========================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});