const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ==========================================
// GMAIL SMTP CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("AdeusiLabs Backend Running 🚀");
});


// ==========================================
// ESTIMATE FORM
// ==========================================

app.post("/estimate", async (req, res) => {

    console.log("=================================");
    console.log("NEW ESTIMATE REQUEST");
    console.log("=================================");

    console.log("Body:", req.body);


    // ------------------------------------------
    // Check request body
    // ------------------------------------------

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "No request body received."
        });
    }


    // ------------------------------------------
    // Get form information
    // ------------------------------------------

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


    // ------------------------------------------
    // Validate required information
    // ------------------------------------------

    if (!name || !email || !business) {
        return res.status(400).json({
            success: false,
            message: "Please provide your name, email and business."
        });
    }


    // ------------------------------------------
    // Email sent TO YOU
    // ------------------------------------------

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: process.env.EMAIL_USER,

        replyTo: email,

        subject: "📩 New AdeusiLabs Estimate Request",

        text: `
NEW ESTIMATE REQUEST
====================

Name:
${name}

Email:
${email}

Business:
${business}

Website Type:
${websiteType || "Not provided"}

Pages:
${pages || "Not provided"}

Features:
${Array.isArray(features) ? features.join(", ") : features || "None"}

Estimated Cost:
${estimatedCost || "Not provided"}

Timeline:
${timeline || "Not provided"}

====================
        `
    };


    try {

        console.log("Sending estimate email to AdeusiLabs...");


        // ------------------------------------------
        // Send notification to YOU
        // ------------------------------------------

        await transporter.sendMail(mailOptions);

        console.log("✅ Email sent to AdeusiLabs");


        // ------------------------------------------
        // Send confirmation to CUSTOMER
        // ------------------------------------------

        try {

            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: email,

                subject: "We've Received Your Estimate Request 🚀",

                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        padding: 30px;
                        max-width: 600px;
                        margin: auto;
                        color: #222;
                    ">

                        <h2 style="color:#A47551;">
                            Hi ${name},
                        </h2>

                        <p>
                            Thanks for requesting a project estimate from
                            <strong>AdeusiLabs.</strong>
                        </p>

                        <p>
                            We've received the following details:
                        </p>

                        <hr>

                        <p>
                            <strong>Business:</strong>
                            ${business}
                        </p>

                        <p>
                            <strong>Website:</strong>
                            ${websiteType || "Not provided"}
                        </p>

                        <p>
                            <strong>Pages:</strong>
                            ${pages || "Not provided"}
                        </p>

                        <p>
                            <strong>Features:</strong>
                            ${
                                Array.isArray(features)
                                    ? features.join(", ")
                                    : features || "None"
                            }
                        </p>

                        <p>
                            <strong>Estimated Cost:</strong>
                            ${estimatedCost || "Not provided"}
                        </p>

                        <p>
                            <strong>Timeline:</strong>
                            ${timeline || "Not provided"}
                        </p>

                        <hr>

                        <p>
                            I'll personally review your request and get back
                            to you within 24 hours with a more accurate proposal.
                        </p>

                        <p>
                            Looking forward to building something amazing together.
                        </p>

                        <h3 style="color:#A47551;">
                            — Dorcas
                            <br>
                            AdeusiLabs
                        </h3>

                    </div>
                `
            });

            console.log("✅ Confirmation email sent to customer");

        } catch (customerEmailError) {

            // IMPORTANT:
            // If the customer confirmation fails,
            // we don't want to pretend the entire request failed.

            console.error(
                "⚠️ Customer confirmation email failed:",
                customerEmailError.message
            );

        }


        // ------------------------------------------
        // Tell frontend everything worked
        // ------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Estimate submitted successfully!"

        });


    } catch (err) {

        console.error("❌ EMAIL ERROR:");
        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Unable to send estimate email. Please try again later."

        });

    }

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});