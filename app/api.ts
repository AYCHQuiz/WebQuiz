/**
 * Helper function for Ajax calls. Basically wraps an XHR object.
 *
 * @param {string} method HTTP method (e.g. "GET")
 * @param {string} url Target URL (e.g. "/example")
 * @param {Object} params URL parameter, appended with '?' after the url
 * @param {Function} callback Is called when the Ajax call finished
 */
function ajax(method: string, url: string, params: { [key:string]:string; }, callback: (err, data?)=>void) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        const response = JSON.parse(req.responseText);
        if(response.status !== "success") {
            callback(response);
            return;
        }
        callback(null, response.data);
    });
    req.addEventListener("error", () => {
        callback("Network Error");
    });
    let query = "";
    for(let key in params) {
        if(query === "") {
            query = "?"; // add ? for the first key-value pair
        } else {
            query += "&"; // add & for subsequent key-value pairs
        }
        query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    }
    req.open(method, url + query);
    req.send();
}

const tagsWithCountCache = {}; // in-memory cache

export function getTagsWithCount(tags: string[], callback: (err, data?)=>void) {
    const key = JSON.stringify(tags);
    if(tagsWithCountCache[key]) {
        // found value in cache
        callback(null, tagsWithCountCache[key]);
    } else {
        // did not found value in cache
        ajax("GET", "/api/tags_with_count", {
            tags: JSON.stringify(tags)
        }, (err, data) => {
            if(err) {
                callback(err);
                return;
            }
            tagsWithCountCache[key] = data; // save in cache
            callback(null, data);
        });
    }
}

export function prewarmTagsWithCountCache(tags: string[], data) {
    tagsWithCountCache[JSON.stringify(tags)] = data;
}

export function getQuiz(tags: string[], callback: (err, data?)=>void) {
    ajax("GET", "/api/quiz", {
        tags: JSON.stringify(tags)
    }, callback);
}
