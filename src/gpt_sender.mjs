import OpenAI from "openai";

function generate_system_text(n,grammer_type){
    const quiz_inst = "You will be given a paragraph, and you should make" + String(n) + "english grammer quiz(es) in a type of multiple choice question.\n";
    const grammer_inst = "The quizzes will be about the usage of be-verbs."; //TODO: add grammer_type variable
    const format_inst = "Give the response as the format given below:\n";
    const format_text = "Question:\"\"\"Insert a question here\"\"\"\n\
                        1)\"\"\"Insert a choice here\"\"\"\n\
                        2)\"\"\"Insert a choice here\"\"\"\n\
                        3)\"\"\"Insert a choice here\"\"\"\n\
                        4)\"\"\"Insert a choice here\"\"\"\n\
                        Answer:\"\"\"Insert a single digit here\"\"\"";

    return quiz_inst + grammer_inst + format_inst + format_text;
}

const openai = new OpenAI();

async function generate_response(sys, user) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: sys },
                {role: "user", content: user},
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);

  return completion.choices[0].message.content;
}