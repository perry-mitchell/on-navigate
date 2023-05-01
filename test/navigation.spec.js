import { expect } from "chai";
import sinon from "sinon";
import sleep from "sleep-promise";
import { NavigationMethod, onNavigate } from "../dist/navigation.js";

describe("onNavigate", function () {
    beforeEach(function () {
        this.urlGetter = sinon.stub().returns("https://test.com");
        this.addEventListener = sinon.stub().callsFake(() => {});
        this.removeEventListener = sinon.stub().callsFake(() => {});
        this.testOptions = {
            methods: [NavigationMethod.Timer],
            timerInterval: 25,
            urlGetter: () => this.urlGetter(),
            windowGetter: () => ({
                addEventListener: this.addEventListener,
                removeEventListener: this.removeEventListener
            })
        };
        this.onNavigate = (...args) => {
            const handler = (this.handler = onNavigate(...args));
            return handler;
        };
    });

    afterEach(function () {
        this.handler.remove();
    });

    it("returns a remove callback", function () {
        const handler = this.onNavigate(() => {}, this.testOptions);
        expect(handler).to.have.property("remove").that.is.a("function");
    });

    describe("using method: timer", function () {
        it("detects URL changes", async function () {
            const cb = sinon.spy();
            this.onNavigate(cb, this.testOptions);
            this.urlGetter.returns("https://test.com/sub-page");
            await sleep(100);
            expect(cb.callCount).to.equal(1);
        });

        it("does not emit false-positives", async function () {
            const cb = sinon.spy();
            this.onNavigate(cb, this.testOptions);
            await sleep(200);
            expect(cb.callCount).to.equal(0);
        });
    });

    describe("using method: popstate", function () {
        beforeEach(function () {
            this.testOptions = {
                ...this.testOptions,
                methods: [NavigationMethod.Popstate]
            };
        });

        it("detects URL changes", async function () {
            const cb = sinon.spy();
            this.onNavigate(cb, this.testOptions);
            this.urlGetter.returns("https://test.com/sub-page");
            this.addEventListener.firstCall.args[1]();
            expect(cb.callCount).to.equal(1);
        });

        it("does not emit false-positives", async function () {
            const cb = sinon.spy();
            this.onNavigate(cb, this.testOptions);
            this.addEventListener.firstCall.args[1]();
            expect(cb.callCount).to.equal(0);
        });
    });

    describe("using method: beforeunload", function () {
        beforeEach(function () {
            this.testOptions = {
                ...this.testOptions,
                methods: [NavigationMethod.BeforeUnload]
            };
        });

        it("detects URL changes", async function () {
            const cb = sinon.spy();
            this.onNavigate(cb, this.testOptions);
            this.urlGetter.returns("https://test.com/sub-page");
            this.addEventListener.firstCall.args[1]();
            expect(cb.callCount).to.equal(1);
        });
    });
});
