import { data as defaultData } from './[slug].js';

/**
 * @param {{ slug: string }} props
 * @returns {Promise<Record<string, unknown>>}
 */
export async function data({ slug } = {}) {
  const mainData = await defaultData({ slug });
  return {
    ...mainData,
    bar: 'This is the bar data loader',
  };
}
