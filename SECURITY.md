# Security Policy

This repository powers [krishnakanthb13.github.io](https://krishnakanthb13.github.io/) —
a static personal site plus a few self-contained tools, notably:

- **Transcript Studio for YouTube** — a browser extension and CLI ([`O/YT/`](O/YT/README.md))
- **PayLink** — a static secure-checkout page ([`S/`](S/README.md))

Everything is open source under the [MIT License](O/YT/LICENSE). The site and
tools run **client-side**: there is no backend, database, or server that stores
user data. Reports are still very welcome.

## Supported Versions

The project is continuously deployed from the `master` branch, so the **latest
deployed version is the only one supported** with fixes. Older tagged builds are
kept for reference and are not patched.

| Component | Version | Supported |
| --- | --- | :---: |
| Site (GitHub Pages, `master`) | latest | :white_check_mark: |
| Transcript Studio — extension | 1.x (latest) | :white_check_mark: |
| Transcript Studio — extension | < 1.x | :x: |
| Transcript Studio — CLI (`ytt`) | latest | :white_check_mark: |
| Any older tagged release | < latest | :x: |

## Reporting a Vulnerability

Please report security issues **privately** — do not open a public issue for an
unfixed vulnerability.

- **Preferred:** [GitHub private security advisory](https://github.com/krishnakanthb13/krishnakanthb13.github.io/security/advisories/new)
  (Security → *Report a vulnerability*).
- **Email:** partythoninc@gmail.com — put `SECURITY` in the subject.

Please include, where you can:

- the affected component (extension, CLI, or a specific page) and version;
- steps to reproduce or a proof of concept;
- the impact you believe it has.

### What to expect

- **Acknowledgement:** within **5 business days**.
- **Status update:** within **14 days**, with an assessment (accepted / declined)
  and, if accepted, a rough fix timeline.
- **Fix & disclosure:** accepted issues are fixed on `master` as soon as
  practical; you'll be credited if you'd like. Please allow a reasonable window
  before public disclosure. Declined reports will include a brief explanation.

As this is a free, single-maintainer hobby project, there is **no bug-bounty or
monetary reward** — but genuine reports are genuinely appreciated. 🙏

## Scope & notes

- **No sensitive data is handled by the project.** Transcript Studio runs locally
  in your browser/terminal; any Google Gemini API key you provide for optional AI
  features is stored locally and sent only to Google's API on your action.
- **PayLink** links out to third-party payment providers (PayPal, Buy Me a Coffee,
  GitHub Sponsors, UPI); it does not collect or process card details itself.
  Vulnerabilities in those third-party services should be reported to them.
- Out of scope: issues requiring a rooted/compromised device, social engineering,
  or third-party platforms (YouTube, Google, GitHub Pages) themselves.
