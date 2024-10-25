import auth from "@/core/auth"

/**
 * Converts a number to a string with the appropriate suffix based on the company's main points name.
 * @param num - The number to convert.
 * @param base - The base string to use. If not provided, it will be determined based on the company's main points name.
 * @param suffix_1 - The suffix for the number 1.
 * @param suffix_2 - The suffix for numbers ending in 2, 3, or 4.
 * @param suffix_5 - The suffix for numbers ending in 0, 5, 6, 7, 8, or 9.
 * @returns The converted string.
 */
export function lang_points(num, base, suffix_1 = '', suffix_2 = 'y', suffix_5 = 'ów') {
    if (!base) {
        switch (this.company.main_points_name) {
            case 'bon':
                base = 'bon';
                break;
            case 'point':
                base = 'point';
                break;
            case 'szans':
                base = 'szans';
                break;
            case 'zł':
                base = 'zł';
                break;
            default:
                base = 'point';
                break;
        }
    }

    num = parseFloat(num.toString());

    let lang = auth.getAppLanguage()

    if (lang === 'pl') {
        const rnum = Math.round(num);
        if (num !== rnum) return base + suffix_5; // fraction
        if (num === 0) return base + suffix_5;
        if (num === 1) return base + suffix_1;
        const last_num = num % 10;
        if (last_num > 1 && last_num < 5 && (num < 10 || num > 20)) return base + suffix_2;
        else return base + suffix_5;
    } else { // en
        if (num === 1) return base;
        else return base + 's'; // warning: there might be exceptions to this rule
    }
}