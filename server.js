const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.get("/", (req, res) => {
    res.send("AdeusiLabs Backend Running 🚀");
});
app.post("/estimate", async (req, res) => {

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    if (!req.body) {
        return res.status(400).json({
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

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📩 New Estimate Request",
        text: `
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
${features.join(", ")}

Estimated Cost:
${estimatedCost}

Timeline:
${timeline}
`
    };

    try{

    
await transporter.sendMail(mailOptions);


await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject: "We've Received Your Estimate Request 🚀",

    html: `
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

            <p><strong>Features:</strong> ${features.join(", ")}</p>

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
                — Dorcas <br>
                AdeusiLabs
            </h3>

        </div>
    `

});

res.json({
    success: true,
    message: "Estimate submitted successfully!"
});

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});