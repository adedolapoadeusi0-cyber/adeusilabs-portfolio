const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/*
========================================
RESEND EMAIL FUNCTION
========================================
*/

async function sendEmail({ to, subject, html, text }) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: "AdeusiLabs <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
            text
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("❌ Resend API Error:", data);
        throw new Error(data.message || "Resend email failed");
    }

    console.log("✅ Email sent successfully:", data);
    return data;
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


    const featureList = Array.isArray(features)
        ? features.join(", ")
        : features || "None";


    /*
    ========================================
    EMAIL TO ADEUSILABS
    ========================================
    */

    const adminText = `
NEW ESTIMATE REQUEST

Name:
${name}

Email:
${email}

Business:
${business}

Website Type:
${websiteType}

Pages:
${pages}

Features:
${featureList}

Estimated Cost:
${estimatedCost}

Timeline:
${timeline}
`;


    const adminHtml = `
        <div style="font-family:Arial,sans-serif;padding:30px;max-width:650px;margin:auto">

            <h2 style="color:#A47551;">
                📩 New Estimate Request
            </h2>

            <hr>

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Business:</strong> ${business}</p>

            <p><strong>Website Type:</strong> ${websiteType}</p>

            <p><strong>Pages:</strong> ${pages}</p>

            <p><strong>Features:</strong> ${featureList}</p>

            <p><strong>Estimated Cost:</strong> ${estimatedCost}</p>

            <p><strong>Timeline:</strong> ${timeline}</p>

            <hr>

            <p>
                This estimate was submitted through the AdeusiLabs website.
            </p>

        </div>
    `;


    /*
    ========================================
    CONFIRMATION EMAIL TO CLIENT
    ========================================
    */

    const clientHtml = `
        <div style="font-family:Arial,sans-serif;padding:30px;max-width:600px;margin:auto">

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

            <p><strong>Business:</strong> ${business}</p>

            <p><strong>Website:</strong> ${websiteType}</p>

            <p><strong>Pages:</strong> ${pages}</p>

            <p><strong>Features:</strong> ${featureList}</p>

            <p><strong>Estimated Cost:</strong> ${estimatedCost}</p>

            <p><strong>Timeline:</strong> ${timeline}</p>

            <hr>

            <p>
                I'll personally review your request and get back to you
                within 24 hours with a more accurate proposal.
            </p>

            <p>
                Looking forward to building something amazing together.
            </p>

            <h3 style="color:#A47551;">
                — Dorcas<br>
                AdeusiLabs
            </h3>

        </div>
    `;


    const clientText = `
Hi ${name},

Thanks for requesting a project estimate from AdeusiLabs.

We've received your request.

Business: ${business}
Website: ${websiteType}
Pages: ${pages}
Features: ${featureList}
Estimated Cost: ${estimatedCost}
Timeline: ${timeline}

I'll personally review your request and get back to you within 24 hours.

— Dorcas
AdeusiLabs
`;


    /*
    ========================================
    SEND EMAILS
    ========================================
    */

    try {

        console.log("📤 Sending estimate to AdeusiLabs...");

        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: "📩 New Estimate Request",
            html: adminHtml,
            text: adminText
        });

        console.log("✅ Estimate email sent to AdeusiLabs");


        console.log("📤 Sending confirmation to client...");

        await sendEmail({
            to: email,
            subject: "We've Received Your Estimate Request 🚀",
            html: clientHtml,
            text: clientText
        });

        console.log("✅ Confirmation email sent to client");


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