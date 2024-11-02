export default function createElement(rootSelector, elements) {
  const container = document.createDocumentFragment(),
        root = document.querySelector(rootSelector)

  root.innerHTML = ''

  elements.forEach(element => root.appendChild(container.appendChild(recursion(element))))

  function recursion(element) {
    if(element.asString) return new DOMParser().parseFromString(element.asString, 'text/html').body.firstChild

    const _element = document.createElement(element.tag),
          excludeAttr = ['tag', 'childrens'],
          attrEntries = Object.entries(element)

    for(let [attrKey, attrVal] of attrEntries) {
      if(!excludeAttr.includes(attrKey)) _element.setAttribute(attrKey, attrVal)
    }

    if(element.childrens) {
      for(let children in element.childrens) {
        const child = element.childrens[children]
        if(typeof child === 'string') {
          _element.appendChild(document.createTextNode(child));
        } else {
          _element.appendChild(recursion(child));
        }
      }
    }

    return _element
  }

  return container;
}