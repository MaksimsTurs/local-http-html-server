export default function connect(component) {
  component = {
    ...component,
    _state: undefined,
    _props: undefined,
    _isFirstRender: true,
    getState: function() {
      return this._state
    },
    setState: function(callback) {
      if(typeof callback === 'function') return this._state = callback(this._state)
      this._state = callback
    }
  }

  return new Proxy(component, {
    get: function(target, property, _) {
      return target[property]
    },
    set: function(target, _, newValue) {
      target['_state'] = newValue
      target['render']()
      return true
    }
  })
}