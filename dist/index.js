// helpers
const checkData = (data) => {
    if (typeof data !== 'object') {
        throw Error('Incorrect data!');
    }
    else {
        return data;
    }
};
// main parsing functions
class TemplateCreator {
    constructor(imagesOptions, addButtonContent, accordionsButtonsContent) {
        this.addButtonContent = '';
        this.accordionsButtonsContent = [];
        this.imagesOptions = imagesOptions;
        this.addButtonContent = addButtonContent;
        this.accordionsButtonsContent = accordionsButtonsContent;
    }
    images(content, index) {
        const imagesData = checkData(content[index]);
        if (!Array.isArray(imagesData)) {
            throw Error('Incorrect data!');
        }
        let imagesList = '';
        imagesData.forEach((image) => {
            imagesList += `<img class="article__image" src="${this.imagesOptions.src}/${image}${this.imagesOptions.extension}"> `;
        });
        return `<div class="article__images-list">${imagesList}</div>`;
    }
    productLists(content, index) {
        const productListData = checkData(content[index]);
        if (Array.isArray(productListData)) {
            throw Error('Incorrect data!');
        }
        let productListTemplate = `<div class="article__product-list__container"><h3>${productListData.title}</h3> <ul class="article__product-list">`;
        productListData.products.forEach(({ name, category_id }) => {
            let productTemplate = `<li class="article__product-list__item">${name}`;
            if (category_id) {
                productTemplate += `<button class="article__product-list__item__button" data-category-id="${category_id}">${this.addButtonContent}</button>`;
            }
            productTemplate += '</li>';
            productListTemplate += productTemplate;
        });
        productListTemplate += '</ul></div>';
        return productListTemplate;
    }
    accordions(content, index) {
        const accordionData = content[index];
        if (typeof accordionData !== 'string') {
            throw Error('Incorrect data!');
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
    numberedLists(content, index) {
        const numberedListData = checkData(content[index]);
        if (!Array.isArray(numberedListData)) {
            throw Error('Incorrect data!');
        }
        let numberedListTemplate = '<ol class="article__numbered-list">';
        numberedListData.forEach((item) => {
            numberedListTemplate += `<li class="article__numbered-list__item">${item}</li>`;
        });
        numberedListTemplate += '</ol>';
        return numberedListTemplate;
    }
}
// init function
export default (article, { images, addProductButtonContent, accordionsButtonsContent }) => {
    const templateCreator = new TemplateCreator(images, addProductButtonContent || 'В корзину', accordionsButtonsContent || ['Дополнительная информация']);
    let template = article.content.trim();
    const shortcuts = [...template.matchAll(/\{\{ \S+ \}\}/g)];
    shortcuts.forEach((shortcut) => {
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
