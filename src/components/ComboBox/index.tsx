import React, { useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme, TextField, Checkbox } from '@material-ui/core/'
import { Autocomplete } from '@material-ui/lab'
import { CheckBoxOutlineBlankOutlined, CheckBoxOutlined } from '@material-ui/icons'

interface IProps {
  value: string
  data: any
  change: any
  label: string
}

const ComboBox: React.FC<IProps> = (props) => {
  const classes = useStyles()
  const icon = <CheckBoxOutlineBlankOutlined fontSize="small" />
  const checkedIcon = <CheckBoxOutlined fontSize="small" />

  const [valueSelected, setValueSelected] = useState('')

  useEffect(() => {
    setValueSelected(props.value)
  },[props.value])

  return (
    <div className={classes.root} style={{ margin: 5, width: '100%' }}>
      {props.data && props.data.length > 0 ? (
        <Autocomplete
          fullWidth
          defaultValue={valueSelected}
          //value={valueSelected}
          renderOption={(option: any, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.descricao}
            </React.Fragment>
          )}
          options={props.data}
          onChange={(i: any, d: any) => d && props.change(d)}
          getOptionLabel={(option: any) => option.name}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label={props.label}  placeholder='Selecione...' />
          )}
        />
      ) : (<small>Carregando...</small>)}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(3)
      }
    }
  })
)

export default ComboBox