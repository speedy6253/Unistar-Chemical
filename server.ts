import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route: Send Email Notification to info@unistarchemicals.in
app.post("/api/send-email", async (req, res) => {
  try {
    const {
      submissionType = "General Enquiry",
      leadId = "N/A",
      applicationId = "N/A",
      firestoreDocId = "N/A",
      docId = "N/A",
      name = "N/A",
      fullName = "N/A",
      company = "N/A",
      designation = "N/A",
      phone = "N/A",
      contactNumber = "N/A",
      whatsapp = "N/A",
      email = "N/A",
      city = "N/A",
      currentLocation = "N/A",
      state = "N/A",
      country = "India",
      position = "N/A",
      productCategory = "N/A",
      selectedProduct = "N/A",
      downloadedCatalogue = "N/A",
      requiredQuantity = "N/A",
      message = "N/A",
      resumeFileName = "N/A",
      resumeDownloadURL = "N/A",
      sourcePage = "N/A",
      timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    } = req.body || {};

    const applicantName = fullName !== "N/A" ? fullName : name;
    const applicantPhone = contactNumber !== "N/A" ? contactNumber : phone;
    const applicantLocation = currentLocation !== "N/A" ? currentLocation : `${city}, ${state}`;
    const appId = applicationId !== "N/A" ? applicationId : leadId;
    const documentId = docId !== "N/A" ? docId : firestoreDocId;

    // Determine subject based on submission type
    let subject = `General Enquiry – ${company && company !== "N/A" ? company : applicantName}`;
    if (submissionType === "Job Application" || position !== "N/A") {
      subject = `New Job Application – ${position}`;
    } else if (submissionType === "Product Enquiry" || submissionType.toLowerCase().includes("product")) {
      subject = `Product Enquiry – ${company}`;
    } else if (submissionType === "Catalogue Download" || submissionType.toLowerCase().includes("catalogue")) {
      subject = `Catalogue Download Request – ${company}`;
    }

    const recipient = process.env.ADMIN_RECIPIENT_EMAIL || "info@unistarchemicals.in";

    // HTML Email Body with Clean Corporate Design
    let htmlBody = "";
    let textBody = "";

    if (submissionType === "Job Application" || position !== "N/A") {
      htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
              .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
              .header { background: #123C74; color: #ffffff; padding: 24px; text-align: left; }
              .header h2 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
              .header p { margin: 4px 0 0 0; font-size: 13px; color: #cff4fc; }
              .content { padding: 24px; }
              .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #123C74; letter-spacing: 0.5px; border-bottom: 2px solid #123C74; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
              .table th { width: 35%; text-align: left; background: #f1f5f9; color: #334155; font-size: 13px; font-weight: 600; padding: 8px 12px; border: 1px solid #e2e8f0; }
              .table td { text-align: left; color: #0f172a; font-size: 13px; padding: 8px 12px; border: 1px solid #e2e8f0; }
              .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>UNISTAR CHEMICALS</h2>
                <p>New Job Application Received</p>
              </div>
              <div class="content">
                <div class="section-title">Application Summary</div>
                <table class="table">
                  <tr><th>Application ID</th><td><strong>${appId}</strong></td></tr>
                  <tr><th>Submission Time</th><td>${timestamp}</td></tr>
                  <tr><th>Position Applied For</th><td><strong style="color: #123C74;">${position}</strong></td></tr>
                  <tr><th>Firestore Doc ID</th><td>${documentId}</td></tr>
                </table>

                <div class="section-title">Applicant Profile</div>
                <table class="table">
                  <tr><th>Full Name</th><td><strong>${applicantName}</strong></td></tr>
                  <tr><th>Current Location</th><td>${applicantLocation}</td></tr>
                  <tr><th>Contact Number</th><td><a href="tel:${applicantPhone}">${applicantPhone}</a></td></tr>
                  <tr><th>Email ID</th><td><a href="mailto:${email}">${email}</a></td></tr>
                </table>

                <div class="section-title">Resume Information</div>
                <table class="table">
                  <tr><th>File Name</th><td>${resumeFileName}</td></tr>
                  <tr><th>Resume Link</th><td><a href="${resumeDownloadURL}" target="_blank" style="color: #2FA8B8; font-weight: bold;">Download Resume</a></td></tr>
                </table>

                <div class="section-title">Source Metadata</div>
                <table class="table">
                  <tr><th>Source Page</th><td>${sourcePage}</td></tr>
                </table>
              </div>
              <div class="footer">
                This automated email notification was generated by Unistar Chemicals Website.
              </div>
            </div>
          </body>
        </html>
      `;

      textBody = `
UNISTAR CHEMICALS - NEW JOB APPLICATION

Subject: New Job Application – ${position}
Application ID: ${appId}
Submission Time: ${timestamp}
Position Applied For: ${position}

APPLICANT DETAILS:
- Full Name: ${applicantName}
- Current Location: ${applicantLocation}
- Contact Number: ${applicantPhone}
- Email ID: ${email}

RESUME DETAILS:
- File Name: ${resumeFileName}
- Resume Download Link: ${resumeDownloadURL}

Source Page: ${sourcePage}
`;
    } else {
      const companyName = company && company !== "N/A" ? company : applicantName || "Valued Client";

      htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
              .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
              .header { background: #0e7490; color: #ffffff; padding: 24px; text-align: left; }
              .header h2 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
              .header p { margin: 4px 0 0 0; font-size: 13px; color: #cff4fc; }
              .content { padding: 24px; }
              .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0e7490; letter-spacing: 0.5px; border-bottom: 2px solid #0e7490; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
              .table th { width: 35%; text-align: left; background: #f1f5f9; color: #334155; font-size: 13px; font-weight: 600; padding: 8px 12px; border: 1px solid #e2e8f0; }
              .table td { text-align: left; color: #0f172a; font-size: 13px; padding: 8px 12px; border: 1px solid #e2e8f0; }
              .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>UNISTAR CHEMICALS</h2>
                <p>New ${submissionType} Received from Website</p>
              </div>
              <div class="content">
                <div class="section-title">Submission Details</div>
                <table class="table">
                  <tr><th>Submission Type</th><td><strong>${submissionType}</strong></td></tr>
                  <tr><th>Lead Ref ID</th><td><strong>${appId}</strong></td></tr>
                  <tr><th>Firestore Doc ID</th><td>${documentId}</td></tr>
                  <tr><th>Date & Time</th><td>${timestamp}</td></tr>
                </table>

                <div class="section-title">Visitor / Client Contact Details</div>
                <table class="table">
                  <tr><th>Full Name</th><td><strong>${applicantName}</strong></td></tr>
                  <tr><th>Company Name</th><td><strong>${companyName}</strong></td></tr>
                  <tr><th>Designation</th><td>${designation}</td></tr>
                  <tr><th>Email Address</th><td><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><th>Mobile Number</th><td><a href="tel:${applicantPhone}">${applicantPhone}</a></td></tr>
                  <tr><th>WhatsApp Number</th><td>${whatsapp}</td></tr>
                  <tr><th>City</th><td>${city}</td></tr>
                  <tr><th>State</th><td>${state}</td></tr>
                  <tr><th>Country</th><td>${country}</td></tr>
                </table>

                <div class="section-title">Enquiry / Request Specifics</div>
                <table class="table">
                  ${productCategory !== "N/A" ? `<tr><th>Product Category</th><td>${productCategory}</td></tr>` : ""}
                  ${selectedProduct !== "N/A" ? `<tr><th>Selected Product</th><td><strong>${selectedProduct}</strong></td></tr>` : ""}
                  ${downloadedCatalogue !== "N/A" ? `<tr><th>Catalogue File</th><td><strong>${downloadedCatalogue}</strong></td></tr>` : ""}
                  ${requiredQuantity !== "N/A" ? `<tr><th>Required Quantity</th><td>${requiredQuantity}</td></tr>` : ""}
                  <tr><th>Requirement / Message</th><td>${message.replace(/\n/g, "<br>")}</td></tr>
                </table>

                <div class="section-title">Technical Source Metadata</div>
                <table class="table">
                  <tr><th>Source Page</th><td>${sourcePage}</td></tr>
                  <tr><th>Visitor Timestamp</th><td>${timestamp}</td></tr>
                </table>
              </div>
              <div class="footer">
                This automated email notification was generated by Unistar Chemicals Website.
              </div>
            </div>
          </body>
        </html>
      `;

      textBody = `
UNISTAR CHEMICALS - NEW WEBSITE SUBMISSION

Submission Type: ${submissionType}
Lead Ref ID: ${appId}
Firestore Doc ID: ${documentId}
Date & Time: ${timestamp}

CLIENT DETAILS:
- Name: ${applicantName}
- Company: ${companyName}
- Designation: ${designation}
- Email: ${email}
- Mobile: ${applicantPhone}
- WhatsApp: ${whatsapp}
- Location: ${applicantLocation}, ${country}

ENQUIRY DETAILS:
- Category: ${productCategory}
- Product: ${selectedProduct}
- Catalogue: ${downloadedCatalogue}
- Quantity: ${requiredQuantity}
- Message: ${message}

METADATA:
- Source Page: ${sourcePage}
`;
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpSecure = process.env.SMTP_SECURE === "true";

    // If SMTP credentials exist, attempt real sending via Nodemailer
    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        console.log(`[SMTP DIAGNOSTICS] Verifying SMTP connection: host=${smtpHost}, port=${smtpPort}, secure=${smtpSecure}, user=${smtpUser}`);

        try {
          await transporter.verify();
          console.log(`[SMTP DIAGNOSTICS] Verification SUCCESS: host=${smtpHost}, port=${smtpPort}, secure=${smtpSecure}, authResult=AUTHENTICATED`);
        } catch (verifyError: any) {
          console.error(`[SMTP DIAGNOSTICS] Verification FAILED:`);
          console.error(`- SMTP Host: ${smtpHost}`);
          console.error(`- SMTP Port: ${smtpPort}`);
          console.error(`- Secure: ${smtpSecure}`);
          console.error(`- Authentication Result: FAILED`);
          console.error(`- Exact Error Code: ${verifyError.code || "N/A"}`);
          console.error(`- Exact Error Message: ${verifyError.message || verifyError}`);
          if (verifyError.command) console.error(`- SMTP Command: ${verifyError.command}`);
          if (verifyError.response) console.error(`- SMTP Response: ${verifyError.response}`);
          if (verifyError.responseCode) console.error(`- Response Code: ${verifyError.responseCode}`);
        }

        const mailOptions = {
          from: `"Unistar Web Enquiry" <${smtpUser}>`,
          to: recipient,
          subject,
          text: textBody,
          html: htmlBody,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Sent notification for ${appId} to ${recipient}`);
        return res.status(200).json({ success: true, delivered: true, recipient, appId });
      } catch (smtpError: any) {
        console.warn(`[EMAIL WARNING] SMTP Relay error (${smtpError.message}). Fallback to server log:`);
        console.log("=================================================");
        console.log(`[EMAIL NOTIFICATION LOGGED FOR ${recipient}]`);
        console.log(`Subject: ${subject}`);
        console.log(`App ID: ${appId}`);
        console.log(`Applicant: ${applicantName} <${email}>, Phone: ${applicantPhone}`);
        console.log(`Type: ${submissionType}`);
        console.log("=================================================");

        return res.status(200).json({
          success: true,
          delivered: false,
          recipient,
          appId,
          note: "Application recorded. SMTP relay warning captured safely.",
        });
      }
    } else {
      // SMTP not fully populated in env variables yet — log details safely to server console
      console.log("=================================================");
      console.log(`[EMAIL NOTIFICATION LOGGED FOR ${recipient}]`);
      console.log(`Subject: ${subject}`);
      console.log(`Lead ID: ${leadId}`);
      console.log(`Client: ${name} (${company}) <${email}>, Phone: ${phone}`);
      console.log(`Type: ${submissionType}`);
      console.log("=================================================");

      return res.status(200).json({
        success: true,
        delivered: false,
        recipient,
        leadId,
        note: "Email payload processed and logged on server. Configure SMTP_USER and SMTP_PASS in environment variables for live SMTP relay.",
      });
    }
  } catch (error: any) {
    console.error("[EMAIL ERROR] Failed to process email notification:", error.message || error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to deliver background email notification",
    });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Unistar Express Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
