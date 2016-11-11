const mustache = require('mustache');
const mathjax = require("mathjax-node/lib/mj-single.js");
const Bluebird = require("bluebird");
const escape = require('escape-html');
const quickperm = require("./quickperm");
const fs = require("fs");
const readFileAsync = Bluebird.promisify(fs.readFile);
const YAML = require('yamljs');

module.exports = {render, renderYAML, renderFile};

/**
 * Render a quiz question from a given file path.
 *
 * @example
 * renderFile("sample-quiz/question1.yml").then((html) => console.log(html));
 *
 * @param {string} path Path to a YAML file.
 * @return {Promise} rendered HTML.
 */
function renderFile(path) {
    return readFileAsync(path, "utf8").then(yaml => renderYAML(yaml));
}

/**
 * Render a quiz question from a YAML string.
 *
 * @param {string} yaml Valid YAML string
 * @return {Promise} rendered HTML
 */
function renderYAML(yaml) {
    return render(YAML.parse(yaml));
}

/**
 * Render a quiz question from parsed YAML.
 *
 * @param {string} question Question object (parsed YAML)
 * @return {Promise} rendered HTML
 */
function render(question) {
    return Bluebird.map(question.content, (snippet, index) => {
        if(typeof snippet === 'string') {
            // render separator
            return renderFunctions[snippet]();
        }

        const keys = Object.keys(snippet);
        if(keys.length !== 1) throw new Error();
        const type = keys[0];
        const options = snippet[type];
        return renderFunctions[type](options, index);
    }).then(renderedSnippets => {
        return renderedSnippets.join("");
    });
}

const renderFunctions = {
    text: renderTextMeta('p'),
    header1: renderTextMeta('h1'),
    header2: renderTextMeta('h2'),
    header3: renderTextMeta('h3'),
    separator: () => '<hr>',
    image: src => {
        return mustache.render('<img src="{{src}}">', {src});
    },
    hint: renderHint,
    task_mc_multiple_correct: renderTaskMCMultipleCorrect,
    task_mc_one_correct: renderTaskMCOneCorrect,
    task_number: renderTaskNumber,
    task_text: renderTaskText
};

/**
 * Examples:
 * - text: Usual paragraph
 * - header1: Largest header
 * - header2: Medium header
 * - header3: Small header
 *
 * @private
 */
function renderTextMeta(tag) {
    return text =>
        renderTextWithMath(text).then(html =>
            mustache.render('<{{tag}}>{{&html}}</{{tag}}>', {tag, html}));
}

/**
 * Renders hint.
 *
 * Example:
 * - hint: This is a good question
 *
 * @private
 */
function renderHint(text) {
    renderTextWithMath(text).then(html =>
        mustache.render(
            `<div class="hint">
                <button class="hint-trigger">Hint</button>
                <span class="hint-content">{{&html}}</span>
            </div>`, {html}));
}

/**
 * Renders task_mc_multiple_correct.
 *
 * Example:
 * - task_mc_multiple_correct:
 *     correct_answers:
 *     - First answer
 *     - Second answer
 *     wrong_answers:
 *     - Last answer
 *
 * @private
 */
function renderTaskMCMultipleCorrect(options, snippetIndex) {
    return Bluebird.join(
        Bluebird.map(options.correct_answers, x => renderTextWithMath(x)),
        Bluebird.map(options.wrong_answers, x => renderTextWithMath(x)),
        (correct, wrong) => collectAnswers(correct, wrong))
    .then(allAnswers =>
        allAnswers.map(answer =>
            mustache.render(
                `<label>
                    <input name="{{name}}" type="checkbox" value="{{value}}"> {{&label}}
                </label>`, {
                    name: snippetIndex + '_' + answer.index,
                    label: answer.value,
                    value: answer.correct ? '1' : '0'})
        ).join("")
    );
}

/**
 * Renders task_mc_one_correct.
 *
 * Example:
 * - task_mc_one_correct:
 *     correct_answer:
 *     - The one ring
 *     wrong_answers:
 *     - Gandalf's ring
 *     - Frodo's ring
 *
 * @private
 */
function renderTaskMCOneCorrect(options, snippetIndex) {
    return Bluebird.join(
        renderTextWithMath(options.correct_answer),
        Bluebird.map(options.wrong_answers, x => renderTextWithMath(x)),
        (correct, wrong) => collectAnswers([correct], wrong))
    .then(allAnswers =>
        allAnswers.map(answer =>
            mustache.render(
                `<label>
                    <input name="{{name}}" type="radio" value="{{&value}}">
                    {{&label}}
                </label>`, {
                    name: snippetIndex,
                    label: answer.value,
                    value: answer.index})
        ).join("")
    );
}

function collectAnswers(correctList, wrongList) {
    return correctList.map((x, i) => {
        return {
            value: x,
            correct: true,
            index: i
        };
    }).concat(wrongList.map((x, i) => {
        return {
            value: x,
            correct: false,
            index: i + correctList.length
        };
    }));
}

/**
 * Renders task_number.
 *
 * Example:
 * - task_number:
 *     before: K =
 *     correct_answer: 2.4
 *     abs_tol: 0.0
 *
 * @private
 */
function renderTaskNumber(options, snippetIndex) {
    return Bluebird.join(
        renderTextWithMath(options.before),
        renderTextWithMath(options.after),
    (before, after) => {
        return mustache.render(
            `<div class="task-number">
                <span class="before">{{before}}</span>
                <input type="number" name="{{name}}">
                <span class="after">{{after}}</span>
            </div>`, {name: snippetIndex, before, after});
    });
}

/**
 * Renders task_text.
 *
 * Example:
 * - task_text:
 *     before: Walls have typically
 *     correct_answer: green
 *     max_len: 20
 *     after: color
 *
 * @private
 */
function renderTaskText(options, snippetIndex) {
    return Bluebird.join(
        renderTextWithMath(options.before),
        renderTextWithMath(options.after),
    (before, after) => {
        return mustache.render(
            `<div class="task-text">
                <span class="before">{{before}}</span>
                <input type="text" name="{{name}}" maxlength="{{maxlength}}">
                <span class="after">{{after}}</span>
            </div>`, {
            name: snippetIndex, before, after,
            maxlength: options.max_len || -1
        });
    });
}

/**
 * Render text with embedded Latex math environments.
 *
 * Text is html-escaped. Math formulas are replaced by embedded SVGs.
 *
 * Example text: "Web quiz is so $3+3$ y"
 *
 * @param {string} text Text with math
 * @return {Promise} rendered HTML
 * @private
 */
function renderTextWithMath(text) {
    text = "" + text;

    // parse text to find $math$ substrings and render them
    var lastIndex = 0;
    var insideMath = false;
    var partials = [];
    while((index = text.indexOf("$", lastIndex)) != -1) {
        const part = text.substring(lastIndex, index);
        if(insideMath) {
            partials.push({ math: part });
        } else {
            partials.push({ text: part });
        }
        insideMath = !insideMath;
        lastIndex = index + 1;
    }
    if(lastIndex < text.length) {
        partials.push({ text: text.substring(lastIndex) });
    }

    // now render
    return Bluebird.map(partials, part => {
        if(part.math) {
            return renderMath(part.math);
        } else {
            return Bluebird.resolve(escape(part.text));
        }
    }).then(renderedPartials => {
        return Bluebird.resolve(renderedPartials.join(""));
    });
}

/**
 * Render Latex math formula to SVG.
 *
 * @param {string} math Latex formula
 * @return {Promise} SVG string
 * @private
 */
function renderMath(math) {
    return new Bluebird(function(resolve, reject) {
        mathjax.typeset({
            math: math,
            format: "TeX",
            svg: true
        }, function (data) {
            if(data.errors) {
                reject(data.errors);
            } else {
                resolve(data.svg);
            }
        });
    });
}
