
const defaultLength = 8;
const chars = 'abcdef1234567890';

/** Generate a random UUID-like string, of N length. */
export function generateRandomString(opt_length?: number) {
    let gen = '';
    let length = opt_length || defaultLength;
    while (length--) {
        gen += chars[Math.floor(Math.random() * chars.length)];
    }
    return gen;
}
