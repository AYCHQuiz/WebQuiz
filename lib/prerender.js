"use strict";
module.exports = {prerender};

function prerender(question) {
    return question.content.map(snippet => {
        if(snippet.task_mc_one_correct) {
            return {
                task_mc_one_correct: {
                    answers: shuffle(collectAnswers(
                        snippet.task_mc_one_correct.correct_answer,
                        snippet.task_mc_one_correct.wrong_answers))
                }
            };
        } else if(snippet.task_mc_multiple_correct) {
            return {
                task_mc_multiple_correct: {
                    answers: shuffle(collectAnswers(
                        snippet.task_mc_multiple_correct.correct_answers,
                        snippet.task_mc_multiple_correct.wrong_answers))
                }
            };
        } else {
            return snippet;
        }
    });
}

function collectAnswers(correctList, wrongList) {
    return correctList.map((x, i) => {
        return {
            value: x,
            correct: true
        };
    }).concat(wrongList.map((x, i) => {
        return {
            value: x,
            correct: false
        };
    }));
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
}
