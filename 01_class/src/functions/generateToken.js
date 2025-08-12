export default function generateToken(input) {
    const encryptionCode = "Tokenizee" + "GENAI";
    let tokens = [];

    for (let i = 0; i < input.length; i++) {
        if (input[i] === " ") {
            tokens.push("_");
            continue;
        }

        const charCode = input.charCodeAt(i);
        const code = charCode + encryptionCode.length;
        tokens.push(code);
    }

    return tokens;
}
