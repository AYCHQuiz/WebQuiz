module.exports = quickperm;

/**
 * http://www.quickperm.org/
 */
function* quickperm(a) {
    a = a.slice(); // work on copy of original
    const N = a.length;
    const p = new Array(N).fill(0);
    var i = 1, j, tmp;
    yield a.slice();
    while(i < N) {
        if(p[i] < i) {
            j = i % 2 == 1 ? p[i] : 0;
            tmp = a[j];
            a[j] = a[i];
            a[i] = tmp;
            yield a.slice();
            p[i]++;
            i = 1;
        } else {
            p[i] = 0;
            i++;
        }
    }
}
