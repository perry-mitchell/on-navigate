import { expect } from "chai";
import { NavigationMethod, onNavigate } from "../dist/navigation.js";

const TEST_OPTIONS = {
    methods: [NavigationMethod.Timer],
    urlGetter: () => "https://test.com",
    windowGetter: () => {}
};

describe("onNavigate", function () {
    it("returns a remove callback", function () {
        const handler = onNavigate(() => {}, TEST_OPTIONS);
        expect(handler).to.have.property("remove").that.is.a("function");
        handler.remove();
    });
});
