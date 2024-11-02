import Render from "../render-lib/renderLib.js";

export default Render.connect({
  render: function() {
    const state = this.getState() || []

  Render.createElement(
    '.files_preview_container',
    [
      {
        tag: 'table',
        class: 'files_preview_table',
        childrens: state.map((file, index) => ({
          tag: 'tr',
          childrens: [
            { tag: 'td', childrens: [file.type] },
            { tag: 'td', childrens: [formAndShort(file.size)] },
            { tag: 'td', childrens: [
                { tag: 'label', childrens: ['Compress wert (in %):'] },
                { tag: 'input', type: 'number', value: '50', max: '100', min: '0', name: `${index}-file-compress`, placeholder: 'Compress wert hier eingeben.' },
              ] 
            },
            { tag: 'td', childrens: [
                { tag: 'label', childrens: ['Datei name:'] },
                { tag: 'input', type: 'text', name: `${index}-file-name`, value: file.name, placeholder: 'Date name hier eingeben.' },
              ] 
            },
          ]
        }))
      }
    ])
  }
})

function formAndShort(num) {
  if((num / 1E6) >= 1) return (num / 1E6).toFixed(2) + ' MB'
  if((num / 1E3) >= 1) return (num / 1E3).toFixed(2) + ' KB' 
  
  return num.toFixed(2) + ' B' 
}