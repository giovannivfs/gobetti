import React from 'react';
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

interface IProps {
  alert: {
    visible: boolean,
    message: string,
    error: boolean
  }
  position: 'top' | 'bottom'
  align: 'left' | 'center' | 'right'
}

const SnackAlert: React.FC<IProps> = (props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: props.position, horizontal: props.align }}
      open={props.alert.visible}
      autoHideDuration={3000}
      style={{ zIndex: 999999999999 }}
    >
      <Alert severity={props.alert.error ? 'error' : 'success'} style={{ zIndex: 9999999999999 }}>{props.alert.message}</Alert>
    </Snackbar>
  )
}

export default SnackAlert