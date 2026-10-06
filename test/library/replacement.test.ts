import { describe, expect, it } from 'vitest';
import applyReplacement from '../../src/replacement';

function execute(pattern: RegExp, input: string): RegExpExecArray {
    return pattern.exec(input) as RegExpExecArray;
}

describe('applyReplacement', () => {
    it('defaults to the first capture group', () => {
        expect(applyReplacement(execute(/user\/([a-z]+)/, 'user/jack'))).toBe('jack');
    });

    it('returns the whole match when the default is used without capture groups', () => {
        expect(applyReplacement(execute(/user\/[a-z]+/, 'user/jack'))).toBe('user/jack');
    });

    it('returns an empty string when the default group did not participate', () => {
        expect(applyReplacement(execute(/user(?:\/([a-z]+))?/, 'user'))).toBe('');
    });

    it('combines multiple and multi-digit capture references', () => {
        const match = execute(/(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)/, 'abcdefghij');
        expect(applyReplacement(match, String.raw`\10:\3:\1`)).toBe('j:c:a');
    });

    it('treats references to missing groups as empty', () => {
        expect(applyReplacement(execute(/([a-z]+)/, 'jack'), String.raw`\1-\5`)).toBe('jack-');
    });

    it('returns literal replacements unchanged', () => {
        expect(applyReplacement(execute(/literal/, 'literal'), 'fixed')).toBe('fixed');
    });

    it('applies upper, lower and end case conversions', () => {
        const match = execute(/^([^/]+)\/(.+)$/, 'straße/MIXED');
        expect(applyReplacement(match, String.raw`\U\1\E-\L\2\E-\2`)).toBe('STRASSE-mixed-MIXED');
    });

    it('applies single-character case conversions to the next character only', () => {
        const match = execute(/^([^/]+)\/(.+)$/, 'hello/WORLD');
        expect(applyReplacement(match, String.raw`\u\1 \l\2`)).toBe('Hello wORLD');
    });

    it('combines single-character and span case conversions', () => {
        expect(applyReplacement(execute(/([a-z]+)/i, 'hELLO'), String.raw`\u\L\1\E`)).toBe('Hello');
    });

    it('applies a pending single-character conversion to the first code point', () => {
        expect(applyReplacement(execute(/(.+)/u, '𐐨x'), String.raw`\u\1`)).toBe('𐐀x');
    });

    it('keeps a pending single-character conversion when a capture is empty', () => {
        expect(applyReplacement(execute(/a(b?)(c)/, 'ac'), String.raw`\u\1\2`)).toBe('C');
    });

    it('interprets escaped control characters', () => {
        expect(applyReplacement(execute(/(x)/, 'x'), String.raw`\a\e\f\n\r\t\v\1`))
            .toBe('\u{7}\u{1B}\f\n\r\t\vx');
    });

    it('unescapes other escaped characters literally', () => {
        expect(applyReplacement(execute(/(x)/, 'x'), String.raw`\/\1\\\$`)).toBe(String.raw`/x\$`);
    });

    it('keeps a trailing backslash', () => {
        expect(applyReplacement(execute(/(x)/, 'x'), '\\1\\')).toBe('x\\');
    });
});
