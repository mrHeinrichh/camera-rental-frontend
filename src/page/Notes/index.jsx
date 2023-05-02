import { useState } from 'react'
import { DataTable, Button } from '@/component'
import { useGetNotesQuery, useDeleteNoteMutation } from '@/state/api/reducer'
import { PacmanLoader } from 'react-spinners'
import { USER, ERROR } from '../../constants'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function () {
  const navigate = useNavigate()
  const { data, isLoading, isError: isNotesError } = useGetNotesQuery({
    populate: 'user',
  })

  const [isDeletingId, setIsDeletingId] = useState(null)

  const auth = useSelector((state) => state.auth)

  const [
    deleteNote,
    { isLoading: isDeleting, isError: isDeleteError },
  ] = useDeleteNoteMutation()

  const headers = ['ID', 'Title', 'Text', 'Completed', 'Employee']

  const keys = [
    {
      key: '_id',
      operation: (value, row) => (
        <Link to={`/dashboard/note/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: 'title',
    },
    {
      key: 'text',
    },
    {
      key: 'completed',
      operation: (value) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'user',
      operation: (value) => (value ? value?.name : ''),
    },
  ]

  const filteredData = data?.details?.filter(
    (note) => note?._id !== isDeletingId,
  )

  const handleDelete = async (id) => {
    setIsDeletingId(id)
    if (window.confirm('Are you sure?')) {
      const response = await deleteNote(id)

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }
      if (response?.data?.success === true) {
        toast.success('Note deleted successfully!', toastProps)
        const newData = data?.details?.filter((note) => note?._id !== id)
        setData({ details: newData })
      } else toast.error('Failed to delete note.', toastProps)
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
      {auth?.user?.roles?.includes(USER.ADMIN) && (
        <Button
          title="Add Note"
          onClick={() => {
            navigate('/dashboard/note/create')
          }}
        />
      )}
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isNotesError ? (
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_NOTE_ERROR}</div>
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
