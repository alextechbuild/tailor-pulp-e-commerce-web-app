export function animate_letters(current_text, delay) {

    const extracted_text = current_text.textContent;
    current_text.textContent = "";

    extracted_text.split(/( )/).forEach((word, _) => {

        const word_span = document.createElement("span");
        word_span.textContent = word;
        word = "";

        let extracted_word = word_span.textContent;
        word_span.textContent = "";

        if (extracted_word === " ") {

            const span = document.createElement("span");
            span.textContent = " ";
            word_span.append(span);
        }
        else {

            extracted_word.split("").forEach((char, index) => {

                const span = document.createElement("span");
                span.textContent = char;
                span.classList.add("letter");
                span.style.animationDelay = `${delay + index * 0.1}s`;
                word_span.append(span);
            });
        }

        current_text.append(word_span);
    });
}

export function animate_words(current_text, delay) {

    const extracted_text = current_text.textContent;
    current_text.textContent = "";

    extracted_text.split(/( )/).forEach((word, _) => {

        const word_span = document.createElement("span");
        word_span.textContent = word;
        word = "";

        if (word_span.textContent === " ") {

            if (current_text.lastElementChild.textContent.trim() !== "") {

                const whitespace_span = document.createElement("span");
                whitespace_span.textContent = " ";
                current_text.append(whitespace_span);
            }
        }
        else {

            word_span.classList.add("word");
            word_span.style.animationDelay = `${delay}s`;
            current_text.append(word_span);
        }
    });
}
