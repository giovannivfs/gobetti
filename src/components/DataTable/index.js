import React from 'react'
import { Button } from '@material-ui/core'
import DataTable from 'react-data-table-component'
import styled from 'styled-components'
import './styles.css'
import { CircularProgress } from '@material-ui/core'
const TextField = styled.input`
  height: 35px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  &:hover {
    cursor: pointer;
  }
`
const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField id='search' type='text' placeholder='Filtrar por nome' aria-label='Search Input' value={filterText} onChange={onFilter} />
    <Button color='secondary' variant='contained' onClick={onClear}>X</Button>
  </>
)

const _DataTable = (props) => {
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const filteredItems = props.search ?
    props.data.filter(item => item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase()))
    :
    props.data
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }
    return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
  }, [filterText, resetPaginationToggle])

  return (
    <>
      {
        (filteredItems || props.loading) ?
          <DataTable
            selectableRows={props.selectable}
            onSelectedRowsChange={({ selectedRows }) => props?.changeRow(selectedRows)}
            columns={props.columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            striped
            highlightOnHover
            subHeaderComponent={props.search && subHeaderComponentMemo}
            // selectableRows
            persistTableHead
            paginationPerPage={15}
            noDataComponent="Não há registros para exibir"
          />
          : (<h4 style={{ textAlign: 'center' }}><CircularProgress /> <br /> Carregando...</h4>)
      }
    </>
  )
}

export default _DataTable