import { describe, it, expect } from 'vitest';
import removeEmpty from '../src/removeEmpty.ts';

describe('removeEmpty', () => {
    it('removes undefined keys recursively and preserves non-undefined values', () => {
        const input = {
            keepString: 'value',
            keepZero: 0,
            keepFalse: false,
            keepEmptyString: '',
            keepNull: null,
            removeTopLevel: undefined,
            nested: {
                keepNested: 'nested',
                removeNested: undefined,
                deep: {
                    keepDeep: 1,
                    removeDeep: undefined,
                },
            },
        };

        const result = removeEmpty(input);

        expect(result).toEqual({
            keepString: 'value',
            keepZero: 0,
            keepFalse: false,
            keepEmptyString: '',
            keepNull: null,
            nested: {
                keepNested: 'nested',
                deep: {
                    keepDeep: 1,
                },
            },
        });
    });
});
