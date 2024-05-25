import OpenAI from "openai";

const openai = new OpenAI({
    apiKey:"sk-proj-ld5NpvILyGuHU0ws4ab3T3BlbkFJMDjpR3PhR1Nwkewh334c",
    dangerouslyAllowBrowser: true 
});

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

function parse(text){

    let questionMatch = text.match(/Question:"([^"]+)"/);
    let answerMatch = text.match(/Answer:"([^"]+)"/);
    let choicesMatch = [...text.matchAll(/\d+\)\s*"([^"]+)"/g)];

    let question = questionMatch ? questionMatch[1] : null;
    let answer = answerMatch ? answerMatch[1] : null;
    let choices = choicesMatch.map(match => match[1]);

    let parse_group =  {question,choices,answer};
    //quiz_object = parse_group; //to be replaced
    return parse_group;

}

function generate_ui(data){
    const container = document.getElementById('quiz-container');

    // Create question element
    const questionElement = document.createElement('p');
    questionElement.textContent = data.question;
    container.appendChild(questionElement);

    // Create choices
    data.choices.forEach((choice, index) => {
        const choiceContainer = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'choice';
        radio.value = index;
        const label = document.createElement('label');
        label.textContent = choice;
        
        choiceContainer.appendChild(radio);
        choiceContainer.appendChild(label);
        container.appendChild(choiceContainer);
    });

    // Create answer element
    const answerElement = document.createElement('p');
    answerElement.textContent = `Answer: ${parseInt(data.answer)}`;
    container.appendChild(answerElement);
}

export function main(){
    var system_text = generate_system_text(4,'a');
    var user_text =  "Typically, a conversation is formatted with a system message first, followed by alternating user and assistant messages.\
    The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation. However note that the system message is optional and the model’s behavior without a system message is likely to be similar to using a generic message such as 'You are a helpful assistant.'\
    The user messages provide requests or comments for the assistant to respond to. Assistant messages store previous assistant responses, but can also be written by you to give examples of desired behavior.\
    Including conversation history is important when user instructions refer to prior messages. In the example above, the user’s final question of 'Where was it played?' only makes sense in the context of the prior messages about the World Series of 2020. Because the models have no memory of past requests, all relevant information must be supplied as part of the conversation history in each request. If a conversation cannot fit within the model’s token limit, it will need to be shortened in some way.\
    "
    var response_text = generate_response(system_text,user_text);
    var quiz_obj = parse(response_text);
    generate_ui(quiz_obj);
}