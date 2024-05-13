import nlp from "compromise";

const text = "";
// const doc = nlp(text);

// const people = doc.people();

// const peopleJson = people.json();

// const pp1 = people.json({ normal: true })[0];
// // .map((p) => ({ text: p.text, normal: p.normal }))

// console.log("pp1", pp1, pp1.length);

// const pp2 = people.compute("normal").json({ normal: true })[0];

// console.log("pp2", pp1, pp1.length);
// const pp2 = people
//     .normalize({
//         unicode: true,
//         punctuation: true,
//         possessives: true,
//     })
//     .json({ normal: true })
//     .map((p) => ({ text: p.text, normal: p.normal }))
//     .slice(7, 10);

// console.log(
//     "normal people",

//     pp2,
//     pp2.length
// );

// const pp3 = people
//     .normalize({
//         unicode: true,
//         punctuation: true,
//         possessives: true,
//     })
//     .unique()
//     .json({ normal: true })
//     .map((p) => ({ text: p.text, normal: p.normal }))
//     .slice(7, 10);

// console.log("unique people", pp3, pp3.length);

// const pp4 = people
//     .normalize({
//         unicode: true,
//         punctuation: true,
//         possessives: true,
//     })
//     .unique()
//     .json({ normal: true })
//     .map((p) => ({ text: p.text, normal: p.normal }));

// console.log("unique people", pp4, pp4.length);

// console.log(
//     "peopleJson",
//     peopleJson.length,
//     peopleJson.map((p) => p.text),
//     peopleJson[9]
// );

console.log("");

console.log("");
// Input string
const text2 =
    "Harry Potter and Hermione Granger meet Jóhn Weasley at Hogwarts. Harry Potter is so wonderfull, that Harry Potter's cool stick defeats Voldemort";

// Process the input text
const doc = nlp(text2).normalize({ unicode: true });

// const nouns = doc.match("#Person+");
const nouns = doc.people();
console.log("huh?", nouns.json({ normal: true, offset: true }));

// const normDoc = doc.normalize({
//     unicode: true,
// });

// console.log("normDoc", [text2], [normDoc.out("text")]);

// // Find unique character names
// const ppl = doc
//     .people()
//     .normalize({
//         unicode: true,
//         punctuation: true,
//         possessives: true,
//     })
//     // .unique()
//     .json({ offset: true });
// console.log("ppl", ppl, "\n");

// const characters = ppl.out("array");

// let total = 0;
// console.log("text", [text2], "\n");
// console.log("characters", characters, "\n");

// // Extract all substrings where the character names are mentioned
// characters.forEach((character) => {
//     const regex = new RegExp(character, "ig");
//     const match = text2.match(regex);
//     console.log(`Character: ${character}`);
//     console.log("match", match, match?.length, match.offset);
//     total += match?.length ?? 0;
//     console.log("");
// });

// console.log("total", total);
