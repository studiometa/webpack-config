export async function data({ pages }) {
  console.log(pages('/notes/**/!(index)*.html'));
  return {
    head: {
      title: 'home',
    },
    foo: ['foo', 'biz'],
    fn() {
      return 'this is value returned by a function';
    },
  };
}
