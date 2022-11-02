export async function data() {
  return {
    foo: ['foo', 'biz'],
    fn() {
      return 'this is value returned by a function';
    },
  };
}
