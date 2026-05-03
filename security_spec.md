# Firebase Security Specification

## 1. Data Invariants
- A promo cannot exist without a valid title, description, and discount label.
- A promo must have a valid type from the allowed enum.
- Start and end dates must be valid timestamps.
- Only the specific admin (aghna1011@gmail.com) with a verified email can perform write operations.
- The `createdAt` field for a promo must be the server time and immutable.

## 2. The "Dirty Dozen" Payloads (Red Team Tests)

1. **Identity Spoofing**: Attempting to create a promo as a non-admin.
2. **Email Verification Bypass**: Attempting to create a promo as a user with `email_verified: false`.
3. **Ghost Field Injection**: Adding a field `isVerified: true` to a promo doc.
4. **Invalid Promo Type**: Setting type to `hack_sale`.
5. **Resource Poisoning**: Using a 1MB string for `promoId`.
6. **Time Travel**: Setting `createdAt` to a past date instead of `serverTimestamp()`.
7. **Negative Priority**: Setting `priority` to a negative number.
8. **Unauthorized List Access**: Although list is public, testing if non-admins can list sensitive collections (if any existed).
9. **Terminal State Lock Bypass**: (Not strictly applicable here as we don't have terminal states yet, but we have immutable `createdAt`).
10. **ID Injection**: Using special characters in the document ID.
11. **Malicious CTA URL**: Injecting a 10KB string into `ctaUrl`.
12. **Unauthorized Announcement Toggle**: Non-admin attempting to toggle `isActive` on announcement.

## 3. The Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
|---|---|---|---|
| promos | Blocked (isAdmin) | N/A | Blocked (isValidId/size) |
| announcement | Blocked (isAdmin) | N/A | Blocked (isValidId/size) |
