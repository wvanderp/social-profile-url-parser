/* eslint-disable unicorn/prefer-string-raw */
import { describe, expect, it } from 'vitest';
import stripAnchors from '../../scripts/stripAnchors';

describe('stripAnchors', () => {
    it.each([
        ['^https?://example\\.com/(\\w+)$', 'https?://example\\.com/(\\w+)'],
        ['^https?://example\\.com/(\\w+)', 'https?://example\\.com/(\\w+)'],
        ['https?://example\\.com/(\\w+)$', 'https?://example\\.com/(\\w+)'],
        ['https?://example\\.com/(\\w+)', 'https?://example\\.com/(\\w+)'],
        ['^https?://example\\.com/(\\w+)\\$', 'https?://example\\.com/(\\w+)\\$'],
        ['^https?://example\\.com/(\\w+)\\\\$', 'https?://example\\.com/(\\w+)\\\\'],
        ['^https?://example\\.com/(\\w+)\\\\\\$', 'https?://example\\.com/(\\w+)\\\\\\$'],
        ['^$', ''],
    ])('converts %s to %s', (input, expected) => {
        expect(stripAnchors(input)).toBe(expected);
    });
});
