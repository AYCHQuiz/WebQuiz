/* tslint:disable:object-literal-sort-keys */
declare const require: any;

import Vue from "vue";
const ResponsiveImage = require("../components/ResponsiveImage.vue").default;
import { expect } from "chai";

describe("ResponsiveImage.vue", () => {
    const buildRespImg = (snippet) => {
        return new Vue({
            render: (h) => {
                return h(ResponsiveImage, { props: { snippet } });
            },
            components: { "resp-img": ResponsiveImage },
        }).$mount();
    };

    it("should render simple image with description", () => {
        const vm = buildRespImg({
            description: "My Test Image",
            source_1x: "http://example.org/test.png",
        });

        const img = vm.$el as HTMLImageElement;
        expect(img.src).to.equal("http://example.org/test.png");
        expect(img.alt).to.equal("My Test Image");
    });

    it("should render image with srcset attribute", () => {
        const vm = buildRespImg({
            description: "My Responsive Image",
            source_1x: "http://example.org/test-1x.png",
            source_2x: "http://example.org/test-2x.png",
            source_4x: "http://example.org/test-4x.png",
        });

        const img = vm.$el as HTMLImageElement;
        expect(img.alt).to.equal("My Responsive Image");
        expect(img.src).to.equal("http://example.org/test-1x.png");
        expect(img.srcset).to.contain("http://example.org/test-1x.png");
        expect(img.srcset).to.contain("http://example.org/test-2x.png");
        expect(img.srcset).to.contain("http://example.org/test-4x.png");
        expect(img.srcset).to.contain("1x");
        expect(img.srcset).to.contain("2x");
        expect(img.srcset).to.contain("4x");
        expect(img.srcset).to.contain(",");
    });
});
