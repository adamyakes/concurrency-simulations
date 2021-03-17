import { BoundedStateStringPipe } from './bounded-state-string.pipe';

describe('BoundedStateStringPipe', () => {
  it('create an instance', () => {
    const pipe = new BoundedStateStringPipe();
    expect(pipe).toBeTruthy();
  });
});
