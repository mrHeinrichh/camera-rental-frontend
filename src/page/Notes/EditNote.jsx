import React from 'react'
import {
  TextField,
  Typography,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import {
  useUpdateNoteMutation,
  useGetNoteByIdQuery,
  useGetUsersQuery,
} from '@/state/api/reducer'
import { useFormik } from 'formik'
import { editNoteValidation } from '../../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { USER, ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function () {
  const navigate = useNavigate()

  const { id } = useParams()

  const { data, isLoading, isError } = useGetNoteByIdQuery(id)

  const { data: getAllNote } = useGetUsersQuery()
  const users = getAllNote?.details ?? []
  const employees = users?.filter((user) =>
    user?.roles?.includes(USER.EMPLOYEE),
  )
  const associatedUser = users?.find(
    (user) => user?._id === data?.details?.user?._id,
  )

  const [updateNote] = useUpdateNoteMutation()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data?.details?.title || '',
      text: data?.details?.text || '',
      user: associatedUser?._id || '',
      completed: data?.details?.completed || false,
    },
    validationSchema: editNoteValidation,
    onSubmit: (values) => {
      updateNote({ id: data?.details?._id, payload: values })
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard/note')
            toast.success('Note edited successfully!', toastProps)
          } else {
            toast.error('Error while editing note.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while editing note.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_NOTES_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit Note
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.completed}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="completed"
                      id="completed"
                      color="primary"
                    />
                  }
                  label="Check This If You Completed Your Task"
                />
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
