import React from 'react'
import {
  TextField,
  Typography,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useAddNoteMutation, useGetUsersQuery } from '@/state/api/reducer'
import { useFormik } from 'formik'
import { createNoteValidation } from '../../validation'
import { useNavigate } from 'react-router-dom'
import { ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { USER } from '@/constants'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

export default function () {
  const navigate = useNavigate()
  const [addNote, isLoading, isError] = useAddNoteMutation()
  const { data } = useGetUsersQuery()

  const auth = useSelector((state) => state.auth)

  const filteredData = data?.details?.filter(
    (user) => user?._id !== auth?.user?._id,
  )

  const users = filteredData ?? []

  const employees = users?.filter((user) =>
    user?.roles?.includes(USER.EMPLOYEE),
  )

  const formik = useFormik({
    initialValues: {
      title: '',
      text: '',
      user: '',
    },
    validationSchema: createNoteValidation,
    onSubmit: (values) => {
      addNote(values)
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard/note')
            toast.success('Note created successfully!', toastProps)
          } else {
            toast.error('Error while creating note.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while creating note.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  return (
    <>
      {!isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Create Note
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="title"
                  name="title"
                  label="Title"
                  fullWidth
                  autoComplete="title"
                  variant="standard"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="text"
                  name="text"
                  label="Text"
                  fullWidth
                  autoComplete="text"
                  variant="standard"
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.text && Boolean(formik.errors.text)}
                  helperText={formik.touched.text && formik.errors.text}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="user-label">Select User</InputLabel>
                <Select
                  labelId="user-label"
                  id="user"
                  name="user"
                  fullWidth
                  value={formik.values.user}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.user && Boolean(formik.errors.user)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Please select an employee
                  </MenuItem>
                  {Array.isArray(employees) &&
                    employees.map((user) => {
                      return (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      )
                    })}
                </Select>
                {formik.touched.user && formik.errors.user && (
                  <Typography variant="caption" color="error">
                    {formik.errors.user}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid}
              sx={{ mt: '1rem' }}
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  )
}
