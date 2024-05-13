import nlp from "compromise";

// Input string
const text =
    "Harry Potter and Hermione Granger meet Jóhn Weasley, Joe Dere at Mr. Mark's. Harry Potter is so wonderfull, that Harry Potter's cool stick defeats Voldemort. What a dude!";

/** @type {any} */
const doc = nlp(text).normalize({ unicode: true });

/** @type {string[]} */
const uniqueNames = [];

/** @type {{[key: string]: string}} */
const displayNames = {};

/** @type {{[key: string]: Offset[]}} */
const nameOffsets = {};

const peopleJson = doc.people().json({ normal: true, offset: true, index: true });

// Remove trailing whitespaces or punctuations ("Ann." or "Ann " -> "Ann")
const trimReg = /[.,\\/#!$%^&*;:{}=\-_`~()]/g;

const removeTrailingPunctuation = (str) => {
    return str.replace(/[\W_]+$/, "");
};

console.log("sentences", doc.sentences().out("array"));
peopleJson.forEach((json) => {
    const { text: displayName, normal, offset } = json;
    console.log(displayName, "mentioned in ", json.terms[0].index[0], "sentence");

    const trimmedNormal = removeTrailingPunctuation(
        nlp(normal)
            .normalize({
                punctuation: true,
                possessives: true,
            })
            .out("text")
    );
    const trimmedDisplayName = removeTrailingPunctuation(
        nlp(displayName)
            .normalize({
                punctuation: true,
                possessives: true,
            })
            .out("text")
    );

    const string = text.slice(offset.start, offset.start + offset.length);
    const trimmedString = removeTrailingPunctuation(string);

    const processedOffset = {
        ...offset,
        string,
        trimmedString,
        trimmedLength: trimmedString.length,
    };

    if (!uniqueNames.includes(trimmedNormal)) {
        uniqueNames.push(trimmedNormal);
        nameOffsets[trimmedNormal] = [processedOffset];
    } else {
        nameOffsets[trimmedNormal].push(processedOffset);
    }
    displayNames[trimmedNormal] = trimmedDisplayName;
});

console.log("");
console.log("");
console.log("Unique People:", uniqueNames);
console.log("Duplicate Offsets:", nameOffsets);
console.log("displayNames:", displayNames);
console.log("hmm?", doc.document.length);

// function createLinkedData(arr) {
//     const linkedData = {};

//     arr.forEach((item) => {
//         linkedData[item] = {
//             relatedValues: arr.filter((value) => value !== item && value.includes(item)),
//         };
//         linkedData[item].relatedValues.forEach(value => value)

//     });

//     return linkedData;
// }

// // const people = createLinkedData(uniqueNames);
// const people = createLinkedData(["harry", "harry potter", "john weasley"]);

// console.log("people", people);
