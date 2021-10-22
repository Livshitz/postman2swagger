import { Script } from '../src/Main';

const main = new Script();

test('should return true', () => {
    expect(main.executeAsScript(null, 'prod', null)).toEqual(true);
});
