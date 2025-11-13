# Security Policy

## Supported Versions

We are committed to maintaining the security of Pilot-Server. Currently, we support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Pilot-Server seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by one of the following methods:

1. **GitHub Security Advisories** (Preferred):
   - Navigate to the [Security tab](https://github.com/statikfintechllc/Pilot-Server/security/advisories/new)
   - Click "Report a vulnerability"
   - Fill out the form with details about the vulnerability

2. **Direct Contact**:
   - Contact the repository maintainers directly through GitHub
   - Include detailed information about the vulnerability

### What to Include

When reporting a vulnerability, please include:

- **Type of vulnerability** (e.g., XSS, CSRF, authentication bypass)
- **Full paths of source file(s)** related to the manifestation of the vulnerability
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability, including how an attacker might exploit it
- **Any potential solutions** you've identified (if applicable)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Investigation**: We'll investigate and validate the reported vulnerability
- **Updates**: We'll keep you informed about our progress
- **Resolution**: We'll work on a fix and coordinate disclosure with you
- **Credit**: We'll credit you for the discovery (if you wish) when we announce the fix

### Security Update Process

1. The vulnerability is received and assigned to a handler
2. The problem is confirmed and affected versions are determined
3. A fix is prepared and tested
4. New releases are made available
5. The vulnerability is publicly disclosed after users have had time to update

## Security Best Practices

When using Pilot-Server:

- Keep your browser up to date
- Be cautious about sharing sensitive trading data
- Use secure connections (HTTPS) when available
- Don't share your authentication credentials
- Review the code before deploying in production environments

## Disclosure Policy

- Security vulnerabilities will be disclosed after a fix is available
- We aim to release security fixes as quickly as possible
- Critical vulnerabilities will be prioritized
- We follow responsible disclosure practices

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue to discuss.

## Security Features

Pilot-Server implements several security features:

- Client-side data storage (no server-side data exposure)
- Firebase Authentication integration
- Input validation and sanitization
- Content Security Policy headers (when deployed)
- Regular dependency updates (when applicable)

Thank you for helping keep Pilot-Server and our users safe!
