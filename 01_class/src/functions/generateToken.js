import constants from "../constants.js";


export default function generateToken(input) {
    const encryptionCode = constants.encryptionCode;
    
    let tokens = [];

    for (let i = 0; i < input.length; i++) {

        // console.log("char:", input[i]);

        // for spaces push a special sign in the array:
        if (input[i] === " ") {
            tokens.push("_");
            continue;
        }

        const charCode = input.charCodeAt(i);
        // console.log("charCode ", charCode);
        const code = charCode + encryptionCode.length;
        // console.log("code generated, ", code);
        tokens.push(code);
    }

    return tokens;
}

// const tokens = generateToken("hello world");
// console.log("result: ", tokens);

// const tokensStr = tokens.join(",")
// console.log("joined: ", tokensStr);

// const tokensArr = tokensStr.split(",");
// console.log("converted, ", tokensArr);