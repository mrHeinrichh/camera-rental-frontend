import React from 'react'
import { useState } from 'react'
import { DataTable, Button } from '@/component'
import { useGetUsersQuery, useDeleteUserMutation } from '@/state/api/reducer'
import { PacmanLoader } from 'react-spinners'
import { ERROR } from '../../constants'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

export default function () {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetUsersQuery()
  const [isDeletingId, setIsDeletingId] = useState(null)

  const [
    deleteUser,
    { isLoading: isDeleting, isError: isDeleteError },
  ] = useDeleteUserMutation()

  const auth = useSelector((state) => state.auth)

  const headers = ['ID', 'User Name', 'Email', 'Roles', 'Images']
  const keys = [
    {
      key: '_id',
      operation: (value, row) => (
        <Link to={`/dashboard/user/${row?._id}`} className="link">
          {row?._id}
        </Link>
      ),
    },
    {
      key: 'name',
    },
    {
      key: 'email',
    },
    {
      key: 'roles',
      operation: (value) => value.join(', '),
    },
    {
      key: 'image',
      operation: (value) => {
        return value.map((image) => (
          <img
            style={{ padding: '0.5rem' }}
            height={60}
            width={75}
            src={image.url}
            alt={image.originalname}
            key={image.public_id}
          />
        ))
      },
    },
  ]

  const filteredData = data?.details?.filter(
    (user) => user?._id !== auth?.user?._id && user?._id !== isDeletingId,
  )

  const handleDelete = async (id) => {
    setIsDeletingId(id)
    if (window.confirm('Are you sure?')) {
      const response = await deleteUser(id)

      const toastProps = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      }
      if (response?.data?.success === true) {
        toast.success('User deleted successfully!', toastProps)
        const newData = data.details.filter((user) => user?._id !== id)
        setData({ details: newData })
      } else toast.error('Failed to delete user.', toastProps)
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
    {
      onClick: handleDelete,
      title: 'Delete',
    },
  ]

  return (
    <>
      <Button
        title="Add User"
        onClick={() => {
          navigate('/dashboard/user/create')
        }}
      />
      {isLoading || isDeleting ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
      ) : isDeleteError ? (
        <div className="errorMessage">{ERROR.DELETE_USER_ERROR}</div>
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
