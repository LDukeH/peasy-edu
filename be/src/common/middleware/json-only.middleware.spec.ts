import { UnsupportedMediaTypeException } from '@nestjs/common';
import { JsonOnlyMiddleware } from './json-only.middleware.js';

describe('JsonOnlyMiddleware', () => {
  const middleware = new JsonOnlyMiddleware();
  const chay = (
    headers: Record<string, string>,
    ketQuaIs: string | false | null,
  ) => {
    const next = vi.fn();
    middleware.use({ headers, is: () => ketQuaIs } as never, {} as never, next);
    return next;
  };

  it('body JSON thì cho qua', () => {
    const next = chay({ 'content-length': '20' }, 'application/json');

    expect(next).toHaveBeenCalledOnce();
  });

  it('không có header body thì cho qua', () => {
    expect(chay({}, null)).toHaveBeenCalledOnce();
  });

  it('POST rỗng với Content-Length: 0 thì cho qua', () => {
    expect(chay({ 'content-length': '0' }, false)).toHaveBeenCalledOnce();
  });

  it.each([{ 'content-length': '20' }, { 'transfer-encoding': 'chunked' }])(
    'body không phải JSON với %o → 415',
    (headers: Record<string, string>) => {
      expect(() => chay(headers, false)).toThrow(UnsupportedMediaTypeException);
    },
  );
});
