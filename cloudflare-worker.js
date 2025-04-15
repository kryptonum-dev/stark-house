export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const data = await request.json();
      const emailData = data.data || {};
      const emailTo = emailData.to ? emailData.to.join(", ") : "Unknown";

      // Filter out confirmation emails - only notify for business emails
      // Check if the recipient is a business email that requires notification
      const businessEmails = ["biuro@starkhouse.pl", "kontakt@starkhouse.pl"]; // Add any other business emails here

      // If the recipient is not in the business emails list, don't send to Slack
      const isBusinessEmail = businessEmails.some(email => emailTo.includes(email));
      if (!isBusinessEmail) {
        return new Response("Confirmation email - no notification needed", { status: 200 });
      }

      const emailSubject = emailData.subject || "No Subject";
      const emailFrom = emailData.from || "Unknown";

      const slackMessage = {
        text: `📩 *New Email Sent!*
        *From:* ${emailFrom}
        *To:* ${emailTo}
        *Subject:* ${emailSubject}`
      };

      const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackMessage),
      });

      return new Response("Notification sent to Slack", { status: 200 });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
