const dataContainer = document.querySelector('.file_input_data_container')
const [pathElement, sizeElement, typeElement] = Array.from(document.querySelectorAll('[data-file-data]'))

document
  .getElementById('file_form_container')
  .addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(),
          input = Array.from(event.currentTarget.getElementsByTagName('input'))[0]

    formData.append('file', input.files?.[0])

    try {
      const path = (await (await fetch('http://localhost:4020/upload', { method: 'POST', body: formData })).json()).OUTPUT_FILE_PATH
      
      Array.from(pathElement.children.item(1).children)[0].textContent = path
      Array.from(pathElement.children.item(1).children)[1].addEventListener('click', async () => await navigator.clipboard.writeText(path))
    } catch(error) {
      console.info(error.message)
    }
  })

document
  .getElementById('file_input')
  .addEventListener('change', (event) => {  
    Array.from(pathElement.children.item(1).children)[0].textContent = 'Keine'
  
    const file = Array.from(event.currentTarget.files)[0],
          blob = URL.createObjectURL(file),
          filePreview = document.querySelector('.file_input_preview_container')
    
    filePreview.innerHTML = /image/.test(file.type) ? `<image src="${blob}"/>` : `<video src="${blob}" controls="false"/>`

    Array.from(sizeElement.children)[1].textContent = formAndShort(file.size)
    Array.from(typeElement.children)[1].textContent = file.type
  })

function formAndShort(num) {
  if((num / 1E6) >= 1) return (num / 1E6).toFixed(2) + ' MB'
  if((num / 1E3) >= 1) return (num / 1E3).toFixed(2) + ' KB' 
  
  return num.toFixed(2) + ' B' 
}