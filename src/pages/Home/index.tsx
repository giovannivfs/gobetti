import React, { useEffect, useState } from "react"
import handlersUser from '../../handlers/User'
import handlersDivida from '../../handlers/Divida'
import ICliente from "../../types/ICliente"
import {formatDate, maskReais} from '../../util'

import {TextField, Button, Container, Typography, Card, CardHeader, Tooltip, IconButton, Select, SelectChangeEvent, MenuItem, FormControl, InputLabel, Drawer, CircularProgress, LinearProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material'
import {makeStyles} from '@material-ui/core'
import FadeIn from 'react-fade-in'
import IDivida from "../../types/IDivida"
import { AddOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from "@material-ui/icons"
import DataTable from '../../components/DataTable'
import { Controller, useForm } from "react-hook-form"
import SnackAlert from "../../components/Alert"

const blankForm = {
  _id: undefined,
  idUsuario: 0,
  motivo: "",
  valor: 0
}

const Home = (): React.ReactElement => {
  const [clientes, setClientes] = useState<ICliente[]>([])
  const [clienteSearch, setClienteSearch] = useState('')
  const [dividas, setDividas] = useState<IDivida[]>([])
  const [editDivida, setEditDivida] = useState<IDivida>(blankForm)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const {control, register, handleSubmit, formState: { errors }, reset } = useForm<IDivida>();
  const [loadingForm, setLoadingForm] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [alert, setAlert] = useState({
    visible: false,
    message: '',
    error: false
  })

  useEffect(() => {
    if(alert.visible){
      setTimeout(() => {
        setAlert({...alert, visible: false})
      }, 3000)
    }
  }, [alert.visible])

  const classes = useStyles()

  const columsDivida = [
    // {
    //   name: 'Id Dívida',
    //   selector: '_id',
    //   sortable: true,
    //   button: true,
    //   width: '30%'
    // },
    {
      name: 'Motivo',
      selector: 'motivo',
      sortable: true,
      button: true,
      width: '50%'
    },
    {
      name: 'Valor',
      cell: (v: IDivida) => maskReais(v.valor),
      selector: 'valor',
      sortable: true,
      button: true,
      width: '15%'
    },
    {
      name: 'Data Criação',
      cell: (v: IDivida) => v.criado ? formatDate(v.criado, false) : '',
      selector: 'criado',
      sortable: true,
      button: true,
      width: '15%'
    },
    {
      width: '10%',
      button: true,
      cell: (obj: IDivida) => (
        <Tooltip title="Editar">
          <IconButton color="primary" aria-label="editar" onClick={() => handleEditDivida(obj)}>
            <EditOutlined /> 
          </IconButton>
        </Tooltip>
      )
    },
    {
      width: '10%',
      button: true,
      cell: (obj: IDivida) => (
        <Tooltip title="Excluir">
          <IconButton color="error" aria-label="excluir" onClick={() => handleOpenDeleteDivida(obj)}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  const getClientes = async (): Promise<void> => {
    const data = await handlersUser.list()
    setClientes(data)
  }
  
  const handleEditDivida = (obj: IDivida) => {
    setEditDivida(obj)
    setDrawerVisible(true)
  }

  const handleOpenDeleteDivida = (obj: IDivida) => {
    setEditDivida(obj)
    setOpenDialog(true)
  }

  const handleClienteSearchChange = async (event: SelectChangeEvent) => {
    setLoadingSearch(true)
    setClienteSearch(event.target.value)
    await getDividaByCliente(event.target.value)
    setLoadingSearch(false)
  }

  const getDividaByCliente = async (idUsuario: string = '') => {
    const data = await handlersDivida.list()
    const filtered: IDivida[] = data.filter(d => d.idUsuario === parseInt(idUsuario))
    setDividas(filtered)
  }

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    setEditDivida(blankForm)
  }

  useEffect(() => {
    getClientes()
  },[])

  useEffect(() => {
    reset(editDivida)
  },[editDivida])

  const handleCreateUpdateDivida = async (divida: IDivida): Promise<void> => {
    setLoadingForm(true)

    const register = editDivida._id ?
      await handlersDivida.update(divida.idUsuario, divida.motivo, divida.valor, editDivida._id)
      :
      await handlersDivida.register(divida.idUsuario, divida.motivo, divida.valor)

    setAlert({visible: true, message: register.message, error: !register.success})
    if (register.success) setDrawerVisible(false) 
    setLoadingForm(false)
    setClienteSearch(divida.idUsuario.toString())
    getDividaByCliente(divida.idUsuario.toString())
    setEditDivida(blankForm)
  }

  const handleDeleteDivida = async (): Promise<void> => {
    const response = await handlersDivida._delete(editDivida._id)
    setAlert({visible: true, message: response.message, error: !response.success})
    setLoadingForm(false)
    getDividaByCliente(editDivida.idUsuario.toString())
    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return(
    <>
      <SnackAlert 
        alert={alert}
        align='center'
        position='top'
      />
      <Container maxWidth="xl" className={classes.paper}>
        <FadeIn delay={200} transitionDuration={200}>
          <Typography variant='h5' color='textSecondary'>
            Gestão de Dívidas
          </Typography>
          <Card className={classes.card}>
            <CardHeader 
              action = {
                <>
                  <Tooltip title="Nova dívida">
                    <Button 
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        setDrawerVisible(true)
                        setEditDivida(blankForm)
                      }}
                      className={classes.buttonRound}
                    >
                      <AddOutlined />
                    </Button>
                  </Tooltip>
                </>
              }
              title="Lista de dívidas"
            />

            <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
              <InputLabel id="clienteSearch-label">Cliente</InputLabel>
              <Select
                disabled={loadingSearch}
                labelId="clienteSearch-label"
                id="clienteSearch"
                label="Cliente"
                onChange={handleClienteSearchChange}
                value={clienteSearch}
              > 
              {
                clientes && (
                  clientes.map(c => (
                    <MenuItem value={c.id}>{c.name}</MenuItem>
                  ))
                )
              }
              </Select>
              {
                loadingSearch && (
                  <LinearProgress />
                )
              }
            </FormControl>


            <DataTable 
              columns={columsDivida}
              data={dividas}
            />
          </Card>
        </FadeIn>
      </Container>

      <Drawer 
        open={drawerVisible}
        anchor='right'
        onClose={handleCloseDrawer}
      >
        <div style={{ padding: 18, width: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {console.log(editDivida)}
            <Typography variant='h5'>
              {editDivida._id ? 'Editando dívida' : "Cadastro de dívida"}
            </Typography>
            <CloseOutlined onClick={handleCloseDrawer} style={{ cursor: 'pointer' }} />
          </div>
          <div className={classes.root} style={{ paddingTop: 8 }}>
            <FadeIn delay={200} transitionDuration={200}>
              <form
                className={classes.form}
                autoComplete='off'
                autoCapitalize='off'
                onSubmit={handleSubmit(handleCreateUpdateDivida)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
                  <TextField 
                    size='small'
                    variant="standard"
                    margin="normal"
                    value={editDivida?._id}
                    disabled
                    fullWidth
                    label="ID"
                  />
                  <Controller 
                    name="idUsuario"
                    control={control}
                    defaultValue={editDivida.idUsuario}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                      <FormControl variant="standard" margin="normal">
                        <InputLabel id="clienteSearch-label">Cliente</InputLabel>
                        <Select
                          labelId="clienteSearch-label"
                          id="clienteSearch"
                          label="Cliente"
                          onChange={onChange}
                          value={value}
                        > 
                        {
                          clientes && (
                            clientes.map(c => (
                              <MenuItem value={c.id}>{c.name}</MenuItem>
                            ))
                          )
                        }
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Controller 
                    name="motivo"
                    control={control}
                    defaultValue={editDivida.motivo}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                      <TextField 
                        size='small'
                        error={!!errors.motivo}
                        helperText={errors.motivo && 'Campo obrigatório'}
                        variant="standard"
                        value={value}
                        fullWidth
                        label="Motivo"
                        margin="normal"
                        placeholder="Digite o motivo da dívida"
                        onChange={(e) => onChange(e.target.value)}
                      />
                    )}
                  />

                  <Controller 
                    name="valor"
                    control={control}
                    defaultValue={editDivida.valor}
                    rules={{required: true,min: 1}}
                    render={({field: {onChange, value}}) => (
                      <TextField 
                        size='small'
                        type='number'
                        error={!!errors.valor}
                        helperText={errors.valor?.type === 'required' ? 'Campo obrigatório' : errors.valor?.type === 'min' ? 'Digite um valor acima de 0' : null}
                        variant="standard"
                        value={value}
                        fullWidth
                        label="Valor"
                        margin="normal"
                        placeholder="Digite o valor da dívida"
                        onChange={(e) => onChange(e.target.value)}
                      />
                    )}
                  />      
                  
                  <Button
                    size='small'
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="submit"
                    disabled={loadingForm}
                  >
                    {loadingForm ? <CircularProgress size={26} color="inherit" /> : 'Gravar'}
                  </Button>
                </div>
              </form>
            </FadeIn>
          </div>
        </div>
      </Drawer>
    
      <Dialog 
        open={openDialog}
        keepMounted
        onClose={handleCloseDialog}   
      >
        <DialogTitle>Realmente deseja excluir a dívida ?</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleDeleteDivida}>Confirmar</Button>
        </DialogActions>
      </Dialog>             
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  card: {
    padding: 15,
    paddingTop: 30,
    borderRadius: 10
  },
  buttonRound: {
    borderRadius: '50% !important',
    height: 60
  },
  form: {
    width: '100%' 
  },
  
}))

export default Home