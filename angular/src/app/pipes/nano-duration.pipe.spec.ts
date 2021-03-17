import { NanoDurationPipe } from './nano-duration.pipe';

describe('NanoDurationPipe', () => {
  it('create an instance', () => {
    const pipe = new NanoDurationPipe();
    expect(pipe).toBeTruthy();
  });
});
