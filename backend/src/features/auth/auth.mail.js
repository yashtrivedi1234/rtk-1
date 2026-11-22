export const welcomeMail = (name) => ({
  subject: "Registration successful",
  text: `Hi ${name}, your account has been created. You can now log in and manage your students.`,
  html: `<h2>Welcome, ${name}!</h2><p>Your account has been created. You can now log in and manage your students.</p>`,
});

export const resetMail = (name, link) => ({
  subject: "Password reset link",
  text: `Hi ${name}, open this link to reset your password (it expires in 15 minutes): ${link}\nIf you did not request this, you can ignore this email.`,
  html: `<p>Hi ${name},</p><p>Click the button below to reset your password. The link expires in <b>15 minutes</b>.</p><p><a href="${link}" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
});
