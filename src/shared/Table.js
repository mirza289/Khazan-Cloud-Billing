
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Row, Col, Button, } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

import { propTypes } from 'react-bootstrap/esm/Image'
import {
  useTable,
  usePagination,
  useSortBy,
  useFlexLayout,
  useResizeColumns,
  useRowSelect,
  useGlobalFilter
} from 'react-table'
import styled from 'styled-components'

const Styles = styled.div`
  .sttt
  {
    box-sizing: border-box;
    flex:none !important;
    min-width: 0px !important;
    width: 0px !important;
  }
  .table-wrap {
    max-width: 100%;
    background-color: #fff;
    border-bottom: 1px solid rgba(0,0,0,.125);
    border-radius: 5px;
    padding-top: 0px;
  }

  .table {
    display: inline-block;
    border-spacing: 0;
    border-radius: 5px;
    
    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }
    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      font-size: 14px;
      border: none;
      ${''
      /*
            border-bottom: 1px solid rgba(0,0,0,.125);
      In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;
      :last-child {
        border-right: 0;
      }
      .resizer {
        display: inline-block;
        background: rgba(0,0,0,.125);
        width: 1px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 0;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;
        &.isResizing {
          background: rgba(0,0,0,.125);
        }
      }
    }

    .th-data {
      margin: 0;
      padding: 0.6rem;
      background-color: #F4F5F5;
      border: none !important;
      ${''/*
      background-color: #fff;
      border-top: 1px solid rgba(0,0,0,.125);
      border-bottom: 1px solid rgba(0,0,0,.125);
      border-right: 1px solid rgba(0,0,0,.125);
    */}
      font-size: 14px;
      font-weight: bold;

    }

    &.sticky {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none; 
 
      .header,
      .footer {
        border:hidden;
        position: sticky;
        z-index: 0;
        border: hidden;
      }

      .header {
        top: 0;
      }

      .body {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }


  }

  .pagination {
    padding-top: 20px;
  }
`
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <div>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </div>
      </>
    )
  }
)

function Table({ columns, data, showSpinnerProp, hiddenColumnsProps, prefix, height, sortByProps, source, nbClusterStatus, handleNotebookClusterSpinner, selecteAll, rowProps = () => ({}) }) {

  const [rowLength, setRowlength] = useState(0)
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    pageCount,
    previousPage,
    selectedFlatRows,
    setPageSize,
    state,

    state: {
      pageIndex,
      pageSize,
      selectedRowIds
    },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        hiddenColumns: hiddenColumnsProps,
        sortBy: sortByProps
      },
      defaultColumn,
    },
    useFlexLayout,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    useResizeColumns,
    hooks => {
      selecteAll === true &&
        hooks.visibleColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            width: 0,
            minWidth: 5,
            disableSortBy: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ])
    }
  )

  const { globalFilter } = state;

  // getting selected row list 
  useEffect(() => {
    if (rowLength !== selectedFlatRows.length)  // dont remove this check its for multiCall handler
    {
      rowProps(selectedFlatRows)
      setRowlength(selectedFlatRows.length)
    }
  }, [selectedFlatRows]);
  // Render the UI for your table
  return (
    <Styles>
      <div className="input-group" style={{ width: '400px' }}>
        {/* <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="las la-search" style={{ fontSize: '24px' }}></i>
          </span>
        </div> */}
        <input
          column sm="2"
          type="text"
          className="form-control table-search-bar"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div className="gutter-20x" />
      <div className={"table-wrap " + height}>
        <div {...getTableProps()} className={"table sticky " + height} >
          <div className="header">
            {headerGroups.map(headerGroup => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map(column => (
                  <div {...column.getHeaderProps(
                    column.getSortByToggleProps(),
                    {
                      className: column.collapse ? 'collapse' : '',
                    })}
                    className={source === 'codeMount' ? "th" : "th-data th"}>
                    {column.render('Header')}
                    {/* Use column.getResizerProps to hook up the events correctly */}
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                    />
                    {/* Add a sort direction indicator */}
                    <span className="float-right">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <i className="las la-sort-down" style={{ fontSize: "18px" }}></i>
                          : <i className="las la-sort-up" style={{ fontSize: "18px" }}></i>
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()} className="body">
            {
              showSpinnerProp ?
                <span style={{ paddingLeft: "5px" }}>
                  <Spinner
                    style={{ marginRight: 10, marginTop: 5, borderBottomWidth: '3px', padding:'0px' }}
                    animation="border"
                    size="sm"
                    variant="dark"
                    role="status" /><span style={{ fontSize: "14px" }}>Loading...</span>
                </span>
                :
                data.length !== 0 ?
                  page.map((row, i) => {
                    prepareRow(row)
                    return (
                      <div key={i} {...row.getRowProps()} className="tr row-item">
                        {row.cells.map(cell => {
                          return (
                            <div {...cell.getCellProps()} className="td">
                              {cell.render('Cell')}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                  :
                  <div className="tr">
                    <div colSpan={columns.length} className="td">
                      <div style={{ textAlign: "center" }}>
                        <div className="gutter-20x"></div>
                        <div className="gutter-10x"></div>
                        <span className='empty-data-icon'></span>
                        <div className="gutter-10x"></div>
                        <div className='empty-data'>No data found</div>
                        <div className="empty-5x"></div>
                        {source !== 'Api' && <div className='empty-data2'>No files in this folder</div>}
                        <div className="gutter-10x"></div>
                      </div>
                    </div>
                  </div>
            }
          </div>
        </div>
      </div>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <Row style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
        <Col lg="6">
          <Button size="sm"
            variant="link"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}>
            <i className="las la-angle-left" style={{fontSize:"18px", color:'black'}}></i>
          </Button>

          <span className='pagination-text'>
            <span>
              {pageIndex + 1} of {pageOptions.length}
            </span>{' '}
          </span>

          <Button size="sm"
            variant="link"
            onClick={() => nextPage()}
            disabled={!canNextPage}>
            <i className="las la-angle-right" style={{fontSize:"18px", color:'black'}}></i>
          </Button>
        </Col>
        <Col style={{ textAlign: "right" }}>
          <select
            className="float-right"
            value={pageSize}
            style={{ fontSize: "14px" }}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}>
            {[10, 20, 30, 40, 50, 300].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Col>
      </Row>
    </Styles>
  )
}

export default Table