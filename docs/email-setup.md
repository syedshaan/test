# Email setup for consultation requests

Consultation emails are sent through Resend. To stop them landing in spam, verify your sending domain.

## 1. Verify the domain in Resend
1. Log in to resend.com and open **Domains → Add Domain**.
2. Enter your domain (for example `pleadlaw.in`).
3. Resend shows DNS records. Add them at your domain registrar.

## 2. Add these DNS records
- **SPF** (TXT on the root domain): `v=spf1 include:amazonses.com ~all`
- **DKIM** (TXT, name and value as shown by Resend): copy exactly from Resend
- **DMARC** (TXT on `_dmarc.yourdomain`): `v=DMARC1; p=none; rua=mailto:you@yourdomain`

Start DMARC at `p=none` to monitor. Move to `p=quarantine` once reports look clean.

## 3. Set the sender
- In Vercel, set `RESEND_FROM_EMAIL` to an address on the verified domain, for example `Pleadlaw <noreply@pleadlaw.in>`.
- Set `OWNER_EMAIL` to the inbox that should receive requests.

## 4. Test
1. Submit the consultation form with your own email.
2. Check the message arrives in the owner inbox, not spam.
3. Reply to it: the reply should go to the address the requester entered (the form sets `reply_to`).

Check the DNS records have propagated (this can take up to 48 hours) before testing.
