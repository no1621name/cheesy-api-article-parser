# cheesy-api-article-parser

Hello there! It's micro-library that helps you working with my another project - [cheesy-api](https://github.com/no1621name/cheesy-api).

## Installing
Just write this command for install:

``` bash
npm i -D cheesyapi-article-parser
```
For typescript install types package:

``` bash
npm i -D @types/cheesyapi
```

## Usage

It's exorts only one function that accepts these arguments:
Name | Type | Default |  Description
| :---: | :---: | :---: | :---: |
article  | Article | - | Main information about article that you get from server
options  | Options | - | Options for parsing

Type 'Options' description:
```ts
{
  images: {
    src: string,
    extension:  '.png' | '.jpg' | '.jpeg' | '.gif' | '.tiff' | '.webp' | '.bmp'
  },
  addProductButtonContent?: string,
  accordionsButtonsContent?: string[]
}
```
### Usage example

``` ts
import parseArticle from 'cheesyapi-article-parser';

const articleLayout = parseArticle(article, {
  images: {
    src: 'https://bestimages.com',
    extension: '.png'
  },
  addProductButtonContent: 'To cart!',
  accordionsButtonsContent: [
    'Additonal info',
    'Tips'
  ]
});

document.querySelector('#myArticle').innerHTML = articleLayout;
```
If you are using Nuxt (as me) just declare a reactive variable and place a function call into onMounted (in OptionsApi - mounted hook). Then insert got layout in 'v-html' directive.

```html
<script setup>
import parseArticle from 'cheesyapi-article-parser';

const parsedArticle = ref('');

onMounted(() => {
  parsedArticle.value = parseArticle(article, {
    images: {
      src: 'https://bestimages.com',
      extension: '.png'
    },
    addProductButtonContent: 'To cart!',
    accordionsButtonsContent: [
      'Additonal info',
      'Tips'
    ]
  });
})
</script>

<template>
  <div class="article__wrapper">
    <div v-html="parsedArticle" class="article__content">
  </div>
</template>
```

<hr/>
If you have some questions/recommendations/offers write them in issues. Good luck!