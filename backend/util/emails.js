const { emailAdd, mailgunDomain, mailgunApi } = require("../config/vars");
const { templates } = require("../config/templates");

//send email to mentioned users
exports.sendEmail = async (
  email = "",
  type = "",
  content = null,
  subject = ""
) => {
  if (email !== "") {
    const getTemplate = await templates(type);
    if (getTemplate) {
      var mailgun = require("mailgun-js")({
        apiKey: mailgunApi,
        domain: mailgunDomain,
      });

      const msg = {
        to: email,
        from: emailAdd,
        subject,
        html: getHtml(getTemplate, content),
      };
      mailgun.messages().send(msg, function (err, body) {
      });
    }
  }
};

function getHtml(text, content) {
  if (content) {
    for (let key in content) {
      text = text.replace(`${key}`, "'" + `${content[key]}` + "'");
    }
  }
  return text;
}
