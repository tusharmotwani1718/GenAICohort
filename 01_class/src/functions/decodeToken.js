export default function decodeToken(tokens) {
    const encryptionCode = "Tokenizee" + "GENAI";
    let output = "";

    tokens.forEach(token => {
        if (token === "_" || token === " ") {
            output += " ";
        } else {
            const charCode = Number(token) - encryptionCode.length;
            output += String.fromCharCode(charCode);
        }
    });

    return output;
}
