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