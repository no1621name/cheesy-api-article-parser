/* eslint-disable no-unused-vars */
// TODO 
/* /// <reference types="cheesyapi" /> */

//
interface Article {
  _id: number;
  title: string;
  description: string;
  preview: string;
  content: string;
  category_id: number; // RecipeCategory
  date: Date;
  productLists: Array<{
    title: string;
    products: Array<{
      name: string;
      category_id: number;
    }>;
  }>;
  images: string[][];
  accordions: string[];
  numberedLists: string[][];
}//

type FieldsForParse = Pick<Article, 'productLists' | 'numberedLists' | 'images' | 'accordions'>;

type Creator = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof FieldsForParse]?: (content: Article[keyof FieldsForParse], index: number) => string
}

interface ImagesOptions {
  src: string,
  extension: `.${('png' | `jp${'e' | ''}g` | 'gif' | 'tiff' | 'png' | 'webp' | 'bmp')}`
}

interface Options {
  images: ImagesOptions,
  addProductButtonContent?: string,
  accordionsButtonsContent?: string[]
}

declare module 'cheesy-api-article-parser' {
  export default function(article: Article, options: Options): string;
}
