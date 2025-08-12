function generateToken(input) {
    let result = 0;
    let tokens = [];

    const encryptionCode = "Tokenizee" + "GENAI";

    for (let i = 0; i < input.length; i++) {
        if (input[i] === " ") {
            tokens.push(result); // store token for current word
            result = 0; // reset for next word
            continue;   // skip processing the space
        }

        const charCode = input.charCodeAt(i); // charCode of specific character.
        const code = i + encryptionCode.length + charCode;
        result += code;
    }

    tokens.push(result); // push last word’s token
    return tokens;
}



export default generateToken;


