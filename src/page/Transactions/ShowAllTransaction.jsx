import { useState } from 'react'
import { DataTable } from '@/component'
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from '@/state/api/reducer'
import { PacmanLoader } from 'react-spinners'
import { USER, ERROR } from '../../constants'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment-timezone'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function () {
  const navigate = useNavigate()

  const auth = useSelector((state) => state.auth)

  const { data, isLoading, isError } = useGetTransactionsQuery({
    populate: ['user', 'cameras'],
  })

  const [isDeletingId, setIsDeletingId] = useState(null)

  const [
    deleteTransaction,
    { isLoading: isDeleting, isError: isDeleteError },
  ] = useDeleteTransactionMutation()

  const headers = ['ID', 'Customer', 'Cameras', 'Status', 'Date']

  const keys = [
    {
      key: '_id',
      operation: (value, row) => (
        <Link to={`/dashboard/transaction/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: 'user',
      operation: (value) => (value ? value?.name : ''),
    },
    {
      key: 'cameras',
      operation: (value) => value?.map((camera) => camera?.name).join(', '),
    },
    {
      key: 'status',
    },
    {
      key: 'date',
      operation: (value) =>
        moment(value).tz('Asia/Manila').format('YYYY-MM-DD'),
    },
  ]

  const filteredData = data?.details?.filter(
    (transaction) => transaction?._id !== isDeletingId,
  )

  const handleDelete = async (id) => {
    setIsDeletingId(id)
    if (window.confirm('Are you sure?')) {
      const response = await deleteTransaction(id)

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }
      if (response?.data?.success === true) {
        toast.success('Transaction deleted successfully!', toastProps)
        const newData = data?.details?.filter(
          (transaction) => transaction?._id !== id,
        )
        setData({ details: newData })
      } else toast.error('Failed to delete transaction.', toastProps)
    }
  }
  const handleEdit = (id) => {
    navigate(`edit/${id}`)
  }

  const actions = [
    {
      onClick: handleEdit,
      title: 'Edit',
    },
    ...(auth?.user?.roles?.includes(USER.ADMIN)
      ? [
          {
            onClick: handleDelete,
            title: 'Delete',
          },
        ]
      : []),
  ]

  return (
    <>
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_TRANSACTIONS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_TRANSACTION_ERROR}</div>
      ) : (
        filteredData && (
          <DataTable
            headers={headers}
            keys={keys}
            actions={actions}
            data={filteredData}
          />
        )
      )}
    </>
  )
}
