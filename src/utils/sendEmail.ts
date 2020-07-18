import Maligun from "mailgun-js";

const maliGunClient = new Maligun({
	apiKey: process.env.MALIGUN_API_KEY || "",
	domain: "sandbox400a15d9d1764690814537e5882cb3e1.mailgun.org",
});

const sendEmail = (subject: string, html: string) => {
	const emailData = {
		from: "kcdmlry@gmail.com",
		to: "kcdmlry@gmail.com",
		subject,
		html,
	};
	return maliGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
	const emailSubject = `Hello! ${fullName}, please verify your email`;
	const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here </a>`;
	return sendEmail(emailSubject, emailBody);
};
