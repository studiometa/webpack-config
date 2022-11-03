export async function data({ pages }) {
  console.log(pages('/notes/**/!(index)*.html'));
  return {
    foo: ['foo', 'biz'],
    fn() {
      return 'this is value returned by a function';
    },
  };
}
