# Privacy & Data Handling

This project includes a browser extension and a web backend that may process page content to provide AI-driven assistance (form help, translations, voice-command processing). Below is a short privacy overview intended for developers and reviewers. If you publish this extension, you should adapt this to your organization policies and the store requirements.

## What data may be collected or transmitted

- Page content (HTML snippets or text) may be temporarily sent to a server-side endpoint which may forward the content to an external AI provider for analysis or translation.
- Minimal metadata such as the URL or element selectors may be used to contextualize suggestions.
- Voice audio processing occurs in the browser; transcriptions may be sent to server endpoints if using server-side AI processing.

## Keys & secrets

- Provider API keys (e.g., Google Generative AI) must be stored server-side only. Never embed secret keys in client-side code or in the extension bundle.

## Retention and logging

- By default, this reference implementation logs errors and counts of AI calls to console or configured logger. Do not log sensitive page content in production logs.

## Permissions

- The extension requests `https://*/*` by default for content scripts and web accessible resources. This is intentionally narrower than `"<all_urls>"`.
- If broader access is required at runtime, the extension should request `optional_permissions` and prompt the user with clear rationale.

## User controls

- Provide an option to disable sending page content to any server and limit assistant features to client-side operations (e.g., local voice synthesis and DOM-only assistance).

## Compliance

- Ensure compliance with GDPR/CCPA where applicable: document what is collected, how long it's stored, and provide mechanisms for data deletion and opting out.

---

This is a minimal developer-facing privacy note. Before publishing, craft a user-facing privacy policy that includes data access, retention, contact email, and opt-out instructions.
