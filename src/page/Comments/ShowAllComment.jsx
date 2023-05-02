import { useState } from 'react'
import { DataTable } from '@/component'
import {
  useGetCommentsQuery,
  useDeleteCommentMutation,
} from '@/state/api/reducer'
import { PacmanLoader } from 'react-spinners'
import { USER, ERROR } from '../../constants'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

export default function () {
  const auth = useSelector((state) => state.auth)

  const { data, isLoading, isError } = useGetCommentsQuery({
    populate: 'transaction',
  })

  const [isDeletingId, setIsDeletingId] = useState(null)

  const [
    deleteComment,
    { isLoading: isDeleting, isError: isDeleteError },
  ] = useDeleteCommentMutation()

  const headers = ['ID', 'TransService', 'Text', 'Ratings', 'Transaction']

  const keys = [
    {
      key: '_id',
      operation: (value, row) => (
        <Link to={`/dashboard/comment/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: 'transService',
    },
    {
      key: 'text',
    },
    {
      key: 'ratings',
      operation: (value, row) => `${value} stars`,
    },
    {
      key: 'transaction',
      operation: (value) => (value ? value?.status : ''),
    },
  ]

  const filteredData = data?.details?.filter(
    (comment) => comment?._id !== isDeletingId,
  )

  const handleDelete = async (id) => {
    setIsDeletingId(id)
    if (window.confirm('Are you sure?')) {
      const response = await deleteComment(id)

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }
      if (response?.data?.success === true) {
        toast.success('Comment deleted successfully!', toastProps)
        const newData = data?.details?.filter((comment) => comment?._id !== id)
        setData({ details: newData })
      } else toast.error('Failed to delete comment.', toastProps)
    }
  }

  const actions = [
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
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_COMMENT_ERROR}</div>
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
