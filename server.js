const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // for local & hosting

// Allow server to read JSON body
app.use(express.json());

// Serve static files (HTML, CSS, JS, images) from this folder
app.use(express.static(__dirname));

// Contact form endpoint
app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, Email and Message are required.",
    });
  }

  const newMessage = {
    name,
    email,
    subject: subject || "",
    message,
    date: new Date().toISOString(),
  };

  console.log("📩 New contact form submission:");
  console.log(newMessage);
  console.log("----------------------------");

  // ===== Create folder 'messages' and save messages.json inside it =====
  const messagesDir = path.join(__dirname, "messages");

  // create folder if not exist
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir);
  }

  const filePath = path.join(messagesDir, "messages.json");
  let existingMessages = [];

  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      if (fileData) {
        existingMessages = JSON.parse(fileData);
      }
    }
  } catch (err) {
    console.error("Error reading messages.json:", err);
  }

  existingMessages.push(newMessage);

  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(existingMessages, null, 2),
      "utf8"
    );
    console.log("✅ Message saved to", filePath);
  } catch (err) {
    console.error("Error writing to messages.json:", err);
  }

  return res.json({
    success: true,
    message: "Thank you! Your message has been sent.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/index.html`);
});
