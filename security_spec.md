# Security Specification: TTC Organization CMS

## 1. Data Invariants
- `SiteContent`: Must have a `section_key` and a `content` map. Only admins can modify.
- `ContactSubmission`: Must have `name`, `email`, `interest`, and `created_date`. Public can write once, only admins can read.
- `Admin`: UID-based whitelist for elevated permissions.

## 2. The "Dirty Dozen" (Attack Payloads)
1. **Unauthenticated Site Content Write**: Attempt to write to `site_content` without auth. (Expected: DENIED)
2. **Authenticated Non-Admin Write**: Attempt to write to `site_content` as a non-admin user. (Expected: DENIED)
3. **Submission Query Scraping**: Attempt to list `submissions` as an unauthenticated user. (Expected: DENIED)
4. **Identity Spoofing in Submission**: Crafting a submission with a fake `created_date` (not server time). (Expected: DENIED)
5. **Shadow Field Injection**: Adding an `isVerified: true` field to `SiteContent`. (Expected: DENIED by `keys().size()` check)
6. **Malicious ID Poisoning**: Attempt to create a submission with a 1.5KB string as the document ID. (Expected: DENIED by `isValidId`)
7. **PII Leakage**: Attempting to 'get' another user's submission as a non-admin. (Expected: DENIED)
8. **Invalid Interest Enum**: Sending a submission with `interest: 'HACKER'`. (Expected: DENIED)
9. **Massive Payload**: Sending a 10MB message in a submission. (Expected: DENIED by size check)
10. **State Corruption**: Attempting to update a submission field as a public user. (Expected: DENIED)
11. **Orphaned Content**: Creating content without a valid server timestamp. (Expected: DENIED)
12. **Admin Escalation**: Attempting to write to the `admins` collection. (Expected: DENIED)

## 3. Test Runner Logic
Tests should verify that each of the above payloads results in a `PERMISSION_DENIED` error using the `@firebase/rules-unit-testing` framework (conceptually, as we implement the rules directly).
