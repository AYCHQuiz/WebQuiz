interface IQuizConfig {
    url: string;
    title: string;
    description: string;
    lang: string;
    max_questions_per_session: number;
    about: string;
    footer: string;
}

// Parse JSON from script tag with id 'config'
export default (JSON.parse(document.getElementById("config").innerHTML)) as IQuizConfig;
