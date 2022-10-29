// helpers
const checkData = (data: Article[keyof FieldsForParse][number]) => {
  if (typeof data !== 'object') {
    throw Error ('Incorrect data!');
  } else {
    return data;
  }
};

// main parsing functions
class TemplateCreator implements Creator {
  private imagesOptions: ImagesOptions;
  private addButtonContent = '';
  private accordionsButtonsContent: string[] = [];
  constructor(imagesOptions: ImagesOptions, addButtonContent: string, accordionsButtonsContent: string[]) {
    this.imagesOptions = imagesOptions;
    this.addButtonContent = addButtonContent;
    this.accordionsButtonsContent = accordionsButtonsContent;
  }

  public images(content: Article[keyof FieldsForParse], index: number) {
    const imagesData = checkData(content[index]);

    if(!Array.isArray(imagesData)) {
      throw Error ('Incorrect data!');
    }

    let imagesList = '';
    imagesData.forEach((image: string) => {
      imagesList += `<img class="article__image" src="${this.imagesOptions.src}/${image}${this.imagesOptions.extension}"> `;
    });

    return `<div class="article__images-list">${imagesList}</div>`;
  }

  public productLists(content: Article[keyof FieldsForParse], index: number) {
    const productListData = checkData(content[index]);

    if(Array.isArray(productListData)) {
      throw Error ('Incorrect data!');
    }

    let productListTemplate = `<div class="article__product-list__container"><h3>${productListData.title}</h3> <ul class="article__product-list">`;
    productListData.products.forEach(({name, category_id}: {name: string, category_id: number}) => {
      let productTemplate = `<li class="article__product-list__item">${name}`;

      if(category_id) {
        productTemplate += `<button class="article__product-list__item__button" data-category-id="${category_id}">${this.addButtonContent}</button>`;
      }

      productTemplate += '</li>';

      productListTemplate += productTemplate;
    });

    productListTemplate += '</ul></div>';
    return productListTemplate;
  }

  public accordions(content: Article[keyof FieldsForParse], index: number) {
    const accordionData = content[index];
    if(typeof accordionData !== 'string') {
      throw Error ('Incorrect data!');
    }
    const contentId = `accordionContent${index}`;
    const template = `<div class="article__accordion">
      <button onclick="document.querySelector('#${contentId}').classList.toggle('open')" class="article__accordion__toggler">${this.accordionsButtonsContent[index] || 'Дополнительная информация'}</button>
      <div id="${contentId}" class="article__accordion__content">
        ${accordionData}
      </div>
    </div>`;
    return template;
  }

  public numberedLists(content: Article[keyof FieldsForParse], index: number) {
    const numberedListData = checkData(content[index]);
    if(!Array.isArray(numberedListData)) {
      throw Error ('Incorrect data!');
    }
    let numberedListTemplate = '<ol class="article__numbered-list">';
    numberedListData.forEach((item: string) => {
      numberedListTemplate += `<li class="article__numbered-list__item">${item}</li>`;
    });
    numberedListTemplate += '</ol>';
    return numberedListTemplate;
  }
}
// init function
export default (article: Article, { images, addProductButtonContent, accordionsButtonsContent }: Options) => {
  const templateCreator = new TemplateCreator(images, addProductButtonContent || 'В корзину', accordionsButtonsContent || ['Дополнительная информация']);

  let template = article.content.trim();
  const shortcuts = [...template.matchAll(/\{\{ \S+ \}\}/g)];

  shortcuts.forEach((shortcut: RegExpMatchArray) => {
    const shortcutName = shortcut[0].split(' ')[1];
    const key = shortcutName.split(/\[/)[0];
    const index = shortcutName.match(/\d/)[0];
    const shortcutTemplate = templateCreator[key](article[key], index);

    template = template.replace(shortcut[0], shortcutTemplate);
  });

  template += `<style>
    .article__accordion__content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 1s;
    }
    .article__accordion__content.open{
      max-height: 300px;
    }
  </style>`;
  return template;
};
