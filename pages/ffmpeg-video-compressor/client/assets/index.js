import FilesDataPreview from "./js/component/FilesDataPreview.js"

FilesDataPreview.render()
document.getElementById('file_form_input').addEventListener('change', (event) => FilesDataPreview.setState(Array.from(event.target.files)))

document.getElementById('file_form_container')
.addEventListener('submit', async(event) => {
  event.preventDefault()
  
  const formData = new FormData(),
        formInputs = Array.from(event.currentTarget.getElementsByTagName('input'))

  for(let input in formInputs) {
    if(formInputs[input].type !== 'file') {
      formData.append(formInputs[input].name, formInputs[input].value)
    } else {
      for(let file in formInputs[input].files) {
        formData.append(`${file}-file`, formInputs[input].files[file])
      }
    }
 }

  await fetch('http://localhost:4005/upload', { method: 'POST', body: formData })
})