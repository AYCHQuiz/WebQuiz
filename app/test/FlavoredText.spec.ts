/* tslint:disable:object-literal-sort-keys */
declare const require: any;

import Vue from "vue";
const FlavoredText = require("../components/FlavoredText.vue").default;
import { expect } from "chai";

describe("FlavoredText.vue", () => {
    const buildFlText = (value, clazz= "") => {
        return new Vue({
            render: (h) => {
                return h(FlavoredText, { props: { value, clazz } });
            },
            components: { "fl-text": FlavoredText },
        }).$mount();
    };

    it("should render plain text", () => {
        const vm = buildFlText("This is plain old text");

        expect(vm.$el.textContent.trim()).to.equal("This is plain old text");
    });

    it("should render text with math", () => {
        const vm = buildFlText("This is text with some $n1c3$ formulas");

        expect(vm.$el.textContent).to.contain("This is text with some");
        expect(vm.$el.textContent).to.contain("formulas");
        expect(vm.$el.querySelectorAll("img").length).to.equal(1);
        expect(vm.$el.querySelector("img").src).to.contain(encodeURIComponent("n1c3"));
    });

    it("should render text with math at the beginning", () => {
        const vm = buildFlText("$sin(x)/x$ converges to zero");

        expect(vm.$el.textContent).to.contain("converges to zero");
        expect(vm.$el.querySelectorAll("img").length).to.equal(1);
        expect(vm.$el.querySelector("img").src).to.contain(encodeURIComponent("sin(x)/x"));
    });

    it("should allow escaped dollar signs in text", () => {
        const vm = buildFlText("An apple costs \\$1.");

        expect(vm.$el.textContent.trim()).to.equal("An apple costs $1.");
    });

    it("should allow escaped dollar signs in math", () => {
        const vm = buildFlText("An apple costs $\\$1$, oh really?");

        expect(vm.$el.textContent).to.contain("An apple costs");
        expect(vm.$el.textContent).to.contain(", oh really?");
        expect(vm.$el.querySelectorAll("img").length).to.equal(1);
        expect(vm.$el.querySelector("img").src).to.contain(encodeURIComponent("$1"));
    });

    it("should allow a single additional CSS class", () => {
        const vm = buildFlText("Click me", "button");

        /* tslint:disable-next-line:no-unused-expression */
        expect(vm.$el.classList.contains("button")).to.be.true;
    });

    it("should allow multiple additional CSS classes", () => {
        const vm = buildFlText("Click me", "super awesome mega");

        /* tslint:disable:no-unused-expression */
        expect(vm.$el.classList.contains("super")).to.be.true;
        expect(vm.$el.classList.contains("awesome")).to.be.true;
        expect(vm.$el.classList.contains("mega")).to.be.true;
        /* tslint:enable:no-unused-expression */
    });
});
