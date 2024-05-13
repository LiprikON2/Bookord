import nlp from "compromise";

// big body of text
const text =
    "I love eating pizza, but sometimes I prefer pasta. Pizza is my favorite food, and I often order it for delivery.";

// match term
const term = "pizza";

// analyze the text using compromise
const ss = nlp(text).sentences();

console.log("ss", ss.json());
