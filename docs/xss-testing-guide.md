# XSS Testing Guide for QA

> **Portfolio sample.** A sanitised version of a guide I wrote for QA verifying cross-site scripting (XSS) fixes. Ticket links, environments and screenshots have been removed.
>
> ⚠️ **Only test systems you're authorised to test.** This guide is for verifying security fixes in your own test environments.

## QA test approach

**Set up two test environments:**
1. One **with** the fix applied
2. One **without** it, where you can still reproduce the vulnerability

Comparing the two side by side proves the fix works, rather than just showing that one payload no longer fires.

**Use a range of inputs.** The [PortSwigger XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) is a good reference for payloads.

**Focus on fields that accept HTML** (rich text editors, notes, templates). They're the most likely entry points.

**Screenshot every outcome** for the ticket.

## Payload types to try

| Type | Example |
| --- | --- |
| Simple proof of execution | `<script>alert('xss')</script>` |
| Attribute / event injection | `" onmouseover="alert('xss')" autofocus="` |
| Image fallback | `<img src=x onerror=alert('xss')>` |
| URL / `javascript:` (href context) | `javascript:alert('xss')` |
| Breaking out of a script context | `</script><script>alert('xss')</script>` |
| URL-encoded | `%3Cscript%3Ealert(1)%3C%2Fscript%3E` |
| JS-escaped | `\x3Cscript\x3Ealert(1)\x3C\x2Fscript\x3E` |

## Verifying a fix, step by step

1. **Reproduce the original issue.** Use the original payload in the exact same place (form field, header, URL) and confirm it fires in a clean browser profile.
2. **Check the fix is actually deployed.** Confirm which branch the test environment is running before you start.
3. **Retest the same payload.** If it no longer fires, inspect the rendered HTML to confirm the input was **encoded or stripped**, not just broken.
4. **Inspect the source.** Check DevTools for console errors.
5. **Try variations.** Encoded input, event handlers, attribute contexts, URLs, and different content types (JSON, HTML fragments).

## Advanced

- **Stored XSS.** Save the payload somewhere it persists (a comment, a profile), then view it as different users and in different browsers.
- **DOM-based XSS.** Try payloads in the URL `#hash`, the query string, `localStorage`, or anywhere client-side code reads user data. Step through the code in DevTools.

## Tools

- **Scanners:** OWASP ZAP, Burp Suite (Community or Pro), Nikto
- **Browser:** DevTools console, breaking on DOM changes, the Event Listeners panel for unexpected handlers
- **Fuzzing:** Burp Intruder and Repeater for tailored input and encoding variations

## Common mistakes

- **Only checking input validation.** Output encoding is where the real fix lives.
- **Testing as one user.** Try admin and standard roles.
- **Testing in one browser.** Chrome and Firefox at minimum.
- **Trusting the sanitiser blindly.** A misconfigured one leaves gaps.
- **Testing once.** Run it more than once.

## What this shows

Security testing awareness beyond functional QA, a structured method for verifying fixes, and documentation that helps other testers do it themselves.
