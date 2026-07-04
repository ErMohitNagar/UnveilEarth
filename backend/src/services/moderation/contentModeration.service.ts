import logger from '../../utils/logger.js';

/**
 * Patterns that indicate potential prompt injection attempts.
 * Each pattern is tested case-insensitively against user input.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /forget\s+(all\s+)?(your|previous)\s+instructions/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /new\s+instructions?\s*:/i,
  /system\s*:\s*/i,
  /\bact\s+as\s+(a|an)\s+/i,
  /pretend\s+(you\s+are|to\s+be)\s+/i,
  /override\s+(your\s+)?(instructions|rules|guidelines)/i,
  /do\s+not\s+follow\s+(your\s+)?(previous|original)/i,
  /\[\s*system\s*\]/i,
  /\<\s*system\s*\>/i,
  /```\s*system/i,
  /\bDAN\b/,
  /\bjailbreak\b/i,
];

/**
 * Blocklist of harmful content categories.
 * These are broad patterns — expand based on your platform's content policy.
 */
const BLOCKLIST_PATTERNS: RegExp[] = [
  /\b(exploit|traffic(?:king)?)\s+(children|minors|people)\b/i,
  /\bhow\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|explosive)\b/i,
  /\b(child|minor)\s+(abuse|exploitation|pornography)\b/i,
  /\b(drug\s+)?trafficking\b/i,
  /\bterroris[mt]\b/i,
  /\bhate\s+speech\b/i,
  /\bracial\s+supremac/i,
  /\bgenocide\b/i,
];

/** Maximum allowed input length for AI prompts (characters). */
const MAX_INPUT_LENGTH = 10_000;

export const moderationService = {
  /**
   * Sanitize user input before injecting into AI prompts.
   *
   * - Strips detected prompt injection patterns
   * - Collapses excessive whitespace
   * - Truncates to maximum allowed length
   */
  sanitizeForPrompt(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Strip prompt injection patterns
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(sanitized)) {
        logger.warn(
          { pattern: pattern.source },
          '[moderation] Prompt injection pattern detected and stripped',
        );
        sanitized = sanitized.replace(pattern, '[filtered]');
      }
    }

    // Collapse excessive whitespace (more than 2 consecutive newlines, or excessive spaces)
    sanitized = sanitized
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {3,}/g, '  ')
      .trim();

    // Truncate to max length
    if (sanitized.length > MAX_INPUT_LENGTH) {
      logger.warn(
        { originalLength: sanitized.length, maxLength: MAX_INPUT_LENGTH },
        '[moderation] Input truncated to maximum allowed length',
      );
      sanitized = sanitized.slice(0, MAX_INPUT_LENGTH);
    }

    return sanitized;
  },

  /**
   * Check whether the given text is safe according to the content blocklist.
   * Returns true if the content is safe, false if it contains blocked terms.
   */
  isContentSafe(text: string): boolean {
    if (!text || typeof text !== 'string') {
      return true;
    }

    for (const pattern of BLOCKLIST_PATTERNS) {
      if (pattern.test(text)) {
        logger.warn(
          { pattern: pattern.source },
          '[moderation] Blocked content detected',
        );
        return false;
      }
    }

    return true;
  },
};
