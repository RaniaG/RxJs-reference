import { TestScheduler } from 'rxjs/testing';
import { expect } from 'chai';
import { delay, take } from 'rxjs/operators';

describe('RxBookTracker test', () => {

    let scheduler;
    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).deep.equal(expected);
        })
    });

    it('produces a single value and completion message', () => {
        scheduler.run((helpers) => {
            const source = helpers.cold('a|');
            const expected = 'a|';

            helpers.expectObservable(source).toBe(expected)
        })
    })

    it('should delay', () => {
        scheduler.run((helpers) => {
            const source = helpers.cold('-a-b-c-d|');
            const expected = '5ms -a-b-c-d|';

            helpers.expectObservable(source.pipe(delay(5))).toBe(expected);
        })
    })

    it('takes the correct number of variables', () => {
        scheduler.run((helpers) => {
            const source = helpers.cold('--a--b--c--d|');
            const expected = '--a--b--(c|)';//because the completion and c will be sent in the same frame
            const subscription = '^-------!'
            helpers.expectObservable(source.pipe(take(3))).toBe(expected);
            helpers.expectSubscriptions(source.subscriptions).toBe(subscription);
        })
    })
})