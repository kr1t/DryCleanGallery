export const SET_ALERT = (state, {
  type,
  message,
  icon = null,
  translate = false
}) => {
  state.alert = {
    type: type,
    message: message,
    icon: icon,
    translate: translate
  }
}


export const SET_LOADING = (state, {
  loading
}) => {
  state.isLoading = loading
}

export const SET_MODAL_ALERT = (state, {
  status = true,
  modal = { text: '', btn: 'ปิด' }
}) => {

  console.log('dqwlij')

  state.modalAlertStatus = status
  state.modal = modal
}


