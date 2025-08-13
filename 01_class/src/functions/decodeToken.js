import constants from "../constants.js";

export default function decodeToken(tokens) {
    const encryptionCode = constants.encryptionCode;
    let output = "";

    tokens.forEach(token => {
        if (token === "_" || token === " ") {
            output += " ";
        } else {
            const charCode = Number(token) - encryptionCode.length;
            output += String.fromCharCode(charCode);
        }
        // console.log("output: ", output);
    });

    return output;
}

// const encodedTokens = [ "118", "_", "118" ];

// const decoded = decodeToken(encodedTokens);
// console.log("Decoded Token, ", decoded);

