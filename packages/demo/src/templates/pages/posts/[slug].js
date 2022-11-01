export async function data({ slug } = {}) {
  return {
    bar: 'This is the default post data loader',
    slug,
  };
}
