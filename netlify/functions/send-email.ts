import nodemailer from "nodemailer";

interface HandlerEvent {
  httpMethod: string;
  body: string | null;
}

export const handler = async (event: HandlerEvent) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const {
      submissionType = "General Enquiry",
      leadId = "N/A",
      applicationId = "N/A",
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
    } = payload;

    const applicantName = fullName !== "N/A" ? fullName : name;
    const applicantPhone = contactNumber !== "N/A" ? contactNumber : phone;
    const applicantLocation = currentLocation !== "N/A" ? currentLocation : `${city}, ${state}`;
    const appId = applicationId !== "N/A" ? applicationId : leadId;

    let subject = `General Enquiry – ${company && company !== "N/A" ? company : applicantName}`;
    if (submissionType === "Job Application" || position !== "N/A") {
      subject = `New Job Application – ${position}`;
    } else if (submissionType === "Product Enquiry" || submissionType.toLowerCase().includes("product")) {
      subject = `Product Enquiry – ${company}`;
    } else if (submissionType === "Catalogue Download" || submissionType.toLowerCase().includes("catalogue")) {
      subject = `Catalogue Download Request – ${company}`;
    }

    const recipient = process.env.ADMIN_RECIPIENT_EMAIL || "info@unistarchemicals.in";

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
                  <tr><th>Applicant Name</th><td>${applicantName}</td></tr>
                  <tr><th>Email ID</th><td><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><th>Contact Number</th><td>${applicantPhone}</td></tr>
                  <tr><th>Current Location</th><td>${applicantLocation}</td></tr>
                  <tr><th>Resume File</th><td>${resumeFileName}</td></tr>
                  ${resumeDownloadURL && resumeDownloadURL !== "N/A" ? `<tr><th>Resume Link</th><td><a href="${resumeDownloadURL}" target="_blank">Download Resume PDF</a></td></tr>` : ""}
                </table>
              </div>
              <div class="footer">
                This automated email notification was generated by Unistar Chemicals Website.
              </div>
            </div>
          </body>
        </html>
      `;
      textBody = `UNISTAR CHEMICALS - New Job Application
Position: ${position}
Applicant Name: ${applicantName}
Email ID: ${email}
Phone: ${applicantPhone}
Location: ${applicantLocation}
Application ID: ${appId}
Time: ${timestamp}`;
    } else {
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
                <p>New Lead Notification (${submissionType})</p>
              </div>
              <div class="content">
                <div class="section-title">Lead Information</div>
                <table class="table">
                  <tr><th>Lead ID</th><td><strong>${appId}</strong></td></tr>
                  <tr><th>Submission Type</th><td><strong style="color: #123C74;">${submissionType}</strong></td></tr>
                  <tr><th>Timestamp</th><td>${timestamp}</td></tr>
                  <tr><th>Client Name</th><td>${name}</td></tr>
                  <tr><th>Company</th><td>${company}</td></tr>
                  <tr><th>Designation</th><td>${designation}</td></tr>
                  <tr><th>Phone</th><td>${phone}</td></tr>
                  <tr><th>WhatsApp</th><td>${whatsapp}</td></tr>
                  <tr><th>Email Address</th><td><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><th>City / State</th><td>${city}${state !== "N/A" ? `, ${state}` : ""}</td></tr>
                </table>
                ${selectedProduct !== "N/A" || requiredQuantity !== "N/A" ? `
                  <div class="section-title">Product Details</div>
                  <table class="table">
                    ${productCategory !== "N/A" ? `<tr><th>Category</th><td>${productCategory}</td></tr>` : ""}
                    ${selectedProduct !== "N/A" ? `<tr><th>Product</th><td><strong>${selectedProduct}</strong></td></tr>` : ""}
                    ${requiredQuantity !== "N/A" ? `<tr><th>Quantity</th><td>${requiredQuantity}</td></tr>` : ""}
                  </table>
                ` : ""}
                <div class="section-title">Requirement / Message</div>
                <div style="background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; color: #334155; white-space: pre-wrap;">${message}</div>
              </div>
              <div class="footer">
                This automated email notification was generated by Unistar Chemicals Website.
              </div>
            </div>
          </body>
        </html>
      `;
      textBody = `UNISTAR CHEMICALS - Lead Notification (${submissionType})
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
WhatsApp: ${whatsapp}
City/State: ${city}, ${state}
Message: ${message}
Time: ${timestamp}`;
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpSecure = process.env.SMTP_SECURE === "true";

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Unistar Web Enquiry" <${smtpUser}>`,
        to: recipient,
        subject,
        text: textBody,
        html: htmlBody,
      };

      await transporter.sendMail(mailOptions);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, delivered: true, recipient, appId }),
      };
    } else {
      console.log(`[NETLIFY FUNCTION EMAIL LOGGED FOR ${recipient}] Subject: ${subject}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          delivered: false,
          recipient,
          appId,
          note: "Lead processed. Configure SMTP_HOST, SMTP_USER, and SMTP_PASS in Netlify Environment Variables for live email dispatch to info@unistarchemicals.in.",
        }),
      };
    }
  } catch (err: any) {
    console.error("[NETLIFY FUNCTION EMAIL ERROR]:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: err.message || "Failed to process email notification",
      }),
    };
  }
};
